from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

from resume_parser import extract_text_from_pdf, extract_text_from_docx
from text_cleaner import clean_resume_text, clean_job_description
from skill_extractor import extract_skills


app = Flask(__name__)
CORS(app)

# Upload configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
ALLOWED_EXTENSIONS = {"pdf", "doc", "docx"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024


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

    job_description = request.form.get("job_description", "").strip()
    job_description = clean_job_description(job_description)

    if not job_description:
        return jsonify({
            "status": "error",
            "message": "Job description is required"
        }), 400

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
    })


@app.route("/api/extract-resume", methods=["POST"])
def extract_resume():
    if "resume" not in request.files:
        return jsonify({
            "status": "error",
            "message": "No resume file provided"
        }), 400

    file = request.files["resume"]

    job_description = request.form.get("job_description", "").strip()
    job_description = clean_job_description(job_description)
    required_skills = extract_skills(job_description)

    if not job_description:
        return jsonify({
            "status": "error",
            "message": "Job description is required"
        }), 400

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

    file_extension = filename.rsplit(".", 1)[1].lower()

    if file_extension == "pdf":
        extracted_text = extract_text_from_pdf(file_path)

    elif file_extension == "docx":
        extracted_text = extract_text_from_docx(file_path)

    else:
        return jsonify({
            "status": "error",
            "message": "DOC files are not supported for text extraction yet"
        }), 400

    extracted_text = clean_resume_text(extracted_text)
    detected_skills = extract_skills(extracted_text)

    if not extracted_text:
        return jsonify({
            "status": "error",
            "message": "No text could be extracted from the resume"
        }), 400

    return jsonify({
        "status": "success",
        "message": "Resume text extracted and cleaned successfully",
        "filename": filename,
        "text": extracted_text,
        "preprocessed": True,
        "skills": detected_skills,
        "job_description": job_description,
        "required_skills": required_skills
}), 200


if __name__ == "__main__":
    app.run(debug=True)