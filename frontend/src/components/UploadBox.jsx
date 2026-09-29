function UploadBox() {
  return (
    <section className="upload-section">
      <div className="upload-card">
        <h2>Upload Resume</h2>

        <p>Supported formats: PDF, DOCX</p>

        <input type="file" accept=".pdf,.doc,.docx" />

        <textarea
          rows="8"
          placeholder="Paste the Job Description here..."
        ></textarea>

        <button>Analyze Resume</button>
      </div>
    </section>
  );
}

export default UploadBox;