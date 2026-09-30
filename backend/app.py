from flask import Flask, jsonify

app = Flask(__name__)


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