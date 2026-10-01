import { useState } from "react";

function UploadBox() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!resume) {
      setMessage("Please select a resume.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jobDescription);

    setIsUploading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/upload-resume",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Resume upload failed.");
      }

      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="upload-section">
      <div className="upload-card">
        <h2>Upload Resume</h2>

        <p>Supported formats: PDF, DOC, DOCX</p>

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(event) => setResume(event.target.files[0])}
          />

          <textarea
            rows="8"
            placeholder="Paste the Job Description here..."
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
          ></textarea>

          <button type="submit" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Analyze Resume"}
          </button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </section>
  );
}

export default UploadBox;