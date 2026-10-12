
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

from resume_parser import extract_text_from_pdf, extract_text_from_docx
from text_cleaner import clean_resume_text, clean_job_description
from skill_extractor import extract_skills
from matcher import calculate_skill_match


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
            "message": "DOC files are not supported for text extraction yet. Please upload a PDF or DOCX file."
        }), 400

    job_description = request.form.get("job_description", "").strip()
    job_description = clean_job_description(job_description)

    if not job_description:
        return jsonify({
            "status": "error",
            "message": "Job description is required"
        }), 400

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
        return jsonify({
            "status": "error",
            "message": "Unable to read this file. Please upload a valid PDF or DOCX resume."
        }), 400

    extracted_text = clean_resume_text(extracted_text)

    if not extracted_text:
        return jsonify({
            "status": "error",
            "message": "No text could be extracted from the resume. If this is a scanned PDF, text extraction may require OCR."
        }), 400

    detected_skills = extract_skills(extracted_text)
    required_skills = extract_skills(job_description)

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
        "job_description": job_description,
        "required_skills": required_skills,
        "matching_skills": match_result["matching_skills"],
        "missing_skills": match_result["missing_skills"],
        "match_percentage": match_result["match_percentage"],
        "match_score": match_result["match_score"]
    }), 200


if __name__ == "__main__":
    app.run(debug=True)