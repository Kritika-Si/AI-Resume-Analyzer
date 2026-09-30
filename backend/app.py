from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)


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


if __name__ == "__main__":
    app.run(debug=True)