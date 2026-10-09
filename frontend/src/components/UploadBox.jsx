import { useState } from "react";

function UploadBox() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [message, setMessage] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [matchingSkills, setMatchingSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [matchScore, setMatchScore] = useState(0);

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
    setExtractedText("");
    setSkills([]);
    setRequiredSkills([]);
    setMatchingSkills([]);
    setMissingSkills([]);
    setMatchScore(0);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/extract-resume",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Resume extraction failed.");
      }

      setMessage(data.message);
      setExtractedText(data.text);
      setSkills(data.skills || []);
      setRequiredSkills(data.required_skills || []);
      setMatchingSkills(data.matching_skills || []);
      setMissingSkills(data.missing_skills || []);
      setMatchScore(data.match_score ?? data.match_percentage ?? 0);
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
            {isUploading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </form>

        {message && <p>{message}</p>}

        <div className="analysis-results">
          {extractedText && (
            <div className="extracted-text">
              <h3>Extracted Resume Text</h3>
              <pre>{extractedText}</pre>
            </div>
          )}

          {skills.length > 0 && (
            <div className="skills-section">
              <h3>Detected Skills</h3>

              <div className="skills-list">
                {skills.map((skill) => (
                  <span className="skill-tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {requiredSkills.length > 0 && (
            <div className="skills-section">
              <h3>Required Skills</h3>

              <div className="skills-list">
                {requiredSkills.map((skill) => (
                  <span className="skill-tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {matchScore > 0 && (
            <div className="match-score">
              <h3>Resume Match Score</h3>
              <p>{matchScore}%</p>

              <span className="match-status">
                {matchScore >= 80
                  ? "Strong Match"
                  : matchScore >= 50
                  ? "Moderate Match"
                  : "Needs Improvement"}
              </span>
            </div>
          )}

          {matchingSkills.length > 0 && (
            <div className="skills-section matching-skills">
              <h3>Matching Skills</h3>

              <div className="skills-list">
                {matchingSkills.map((skill) => (
                  <span className="skill-tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {missingSkills.length > 0 && (
            <div className="skills-section missing-skills">
              <h3>Missing Skills</h3>

              <div className="skills-list">
                {missingSkills.map((skill) => (
                  <span className="skill-tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default UploadBox;