from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

from resume_parser import extract_text_from_pdf, extract_text_from_docx
from text_cleaner import clean_resume_text, clean_job_description
from skill_extractor import extract_skills
from matcher import calculate_skill_match, normalize_skill
from role_requirements import get_role_requirements

app = Flask(__name__)
CORS(app)

# Upload configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {"pdf", "doc", "docx"}
SUPPORTED_EXTRACTION_EXTENSIONS = {"pdf", "docx"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024


@app.errorhandler(413)
def handle_file_too_large(error):
    return jsonify({
        "status": "error",
        "message": "Resume file exceeds the 5 MB upload limit."
    }), 413


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


def deduplicate_skills(skills):
    """Keep one display name for each normalized skill."""
    unique_skills = {}

    for skill in skills:
        if isinstance(skill, str) and skill.strip():
            normalized = normalize_skill(skill)
            unique_skills.setdefault(normalized, skill.strip())

    return sorted(unique_skills.values(), key=str.lower)


def resolve_job_requirements(job_role, job_description):
    """
    Resolve either a short target role/keyword or a full job description.

    Short inputs are mapped to known role requirements. Longer descriptions
    use the existing skill extraction pipeline.
    """
    job_role = job_role.strip()
    job_description = job_description.strip()

    # The single frontend input may be sent through both form fields.
    # Prefer role mapping when the description is short and recognizable.
    short_input = (
        job_description
        if job_description
        else job_role
    )

    is_short_input = (
        bool(short_input)
        and len(short_input) <= 120
        and "\n" not in short_input
    )

    if is_short_input:
        role_skills = get_role_requirements(short_input)

        if role_skills:
            return ", ".join(role_skills), role_skills

        # If both fields are populated, also try the separate role field.
        if job_role and job_role != short_input:
            role_skills = get_role_requirements(job_role)

            if role_skills:
                return ", ".join(role_skills), role_skills

        # Do not reject a short custom description automatically.
        # It may contain skill names that extract_skills can recognize.
        cleaned_description = clean_job_description(short_input)
        return cleaned_description, extract_skills(cleaned_description)

    # A longer input is treated as a full job description.
    if job_description:
        cleaned_description = clean_job_description(job_description)
    elif job_role:
        role_skills = get_role_requirements(job_role)

        if not role_skills:
            return None, None

        return ", ".join(role_skills), role_skills
    else:
        return None, None

    return cleaned_description, extract_skills(cleaned_description)


@app.route("/")
def home():
    return jsonify({
        "message": "AI Resume Analyzer API is running"
    })


@app.route("/api/health")
def health_check():
    return jsonify({
        "status": "success",
        "message": "Backend is healthy"
    })


@app.route("/api/upload-resume", methods=["POST"])
def upload_resume():
    if "resume" not in request.files:
        return jsonify({
            "status": "error",
            "message": "No resume file provided"
        }), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({
            "status": "error",
            "message": "No file selected"
        }), 400

    if not allowed_file(file.filename):
        return jsonify({
            "status": "error",
            "message": "Only PDF, DOC, and DOCX files are allowed"
        }), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)

    return jsonify({
        "status": "success",
        "message": "Resume uploaded successfully",
        "filename": filename
    }), 200


@app.route("/api/extract-resume", methods=["POST"])
def extract_resume():
    if "resume" not in request.files:
        return jsonify({
            "status": "error",
            "message": "No resume file provided"
        }), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({
            "status": "error",
            "message": "No file selected"
        }), 400

    if not allowed_file(file.filename):
        return jsonify({
            "status": "error",
            "message": "Only PDF, DOC, and DOCX files are allowed"
        }), 400

    filename = secure_filename(file.filename)
    _, extension = os.path.splitext(filename)
    file_extension = extension.lower().lstrip(".")

    if file_extension not in SUPPORTED_EXTRACTION_EXTENSIONS:
        return jsonify({
            "status": "error",
            "message": (
                "DOC files are not supported for text extraction yet. "
                "Please upload a PDF or DOCX file."
            )
        }), 400

    job_role = request.form.get("job_role", "").strip()
    job_description = request.form.get("job_description", "").strip()

    resolved_description, role_skills = resolve_job_requirements(
        job_role,
        job_description
    )

    if resolved_description is None:
        return jsonify({
            "status": "error",
            "message": (
                "Please enter a target role, recognized keywords, "
                "or a full job description."
            )
        }), 400

    # Store the uploaded resume using a unique filename.
    name, extension = os.path.splitext(filename)
    filename = f"{name}_{os.urandom(4).hex()}{extension}"
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)

    try:
        if file_extension == "pdf":
            extracted_text = extract_text_from_pdf(file_path)
        else:
            extracted_text = extract_text_from_docx(file_path)

    except Exception:
        app.logger.warning(
            "Resume text extraction failed for uploaded file.",
            exc_info=True
        )

        if os.path.exists(file_path):
            os.remove(file_path)

        return jsonify({
            "status": "error",
            "message": (
                "Unable to read this file. Please upload a valid PDF "
                "or DOCX resume."
            )
        }), 400

    finally:
        # Uploaded copies are temporary; don't retain them unnecessarily.
        if os.path.exists(file_path):
            os.remove(file_path)

    extracted_text = clean_resume_text(extracted_text)

    if not extracted_text:
        return jsonify({
            "status": "error",
            "message": (
                "No text could be extracted from the resume. If this is "
                "a scanned PDF, text extraction may require OCR."
            )
        }), 400

    detected_skills = deduplicate_skills(
        extract_skills(extracted_text)
    )

    # Use mapped requirements for recognized short roles.
    # Otherwise extract skills from the cleaned full description.
    if role_skills:
        required_skills = deduplicate_skills(role_skills)
    else:
        required_skills = deduplicate_skills(
            extract_skills(resolved_description)
        )

    match_result = calculate_skill_match(
        detected_skills,
        required_skills
    )

    return jsonify({
        "status": "success",
        "message": "Resume text extracted and cleaned successfully",
        "filename": filename,
        "text": extracted_text,
        "preprocessed": True,
        "skills": detected_skills,
        "job_description": resolved_description,
        "required_skills": required_skills,
        "matching_skills": match_result["matching_skills"],
        "missing_skills": match_result["missing_skills"],
        "match_percentage": match_result["match_percentage"],
        "match_score": match_result["match_score"]
    }), 200


if __name__ == "__main__":
    from waitress import serve

    port = int(os.environ.get("PORT", 5000))
    serve(app, host="0.0.0.0", port=port)
