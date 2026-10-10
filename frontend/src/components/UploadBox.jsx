
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
  const [hasResults, setHasResults] = useState(false);

  const clearResults = () => {
    setExtractedText("");
    setSkills([]);
    setRequiredSkills([]);
    setMatchingSkills([]);
    setMissingSkills([]);
    setMatchScore(0);
    setHasResults(false);
  };

  const handleResumeChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setResume(null);
    clearResults();
    setMessage("");

    if (!selectedFile) return;

    const allowedExtensions = /\.(pdf|doc|docx)$/i;

    if (!allowedExtensions.test(selectedFile.name)) {
      setMessage("Please select a PDF, DOC, or DOCX file.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage("File size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    setResume(selectedFile);
    setMessage(`Selected resume: ${selectedFile.name}`);
  };

  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
    setMessage("");
    clearResults();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!resume) {
      setMessage("Please select your resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      setMessage("Please enter a job description.");
      return;
    }

    setIsUploading(true);
    setMessage("Analyzing your resume...");
    clearResults();

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("job_description", jobDescription.trim());

      const response = await fetch(
        "http://127.0.0.1:5000/api/extract-resume",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Resume analysis failed."
        );
      }

      setExtractedText(data.text || "");
      setSkills(data.skills || []);
      setRequiredSkills(data.required_skills || []);
      setMatchingSkills(data.matching_skills || []);
      setMissingSkills(data.missing_skills || []);
      setMatchScore(data.match_score ?? data.match_percentage ?? 0);
      setMessage(data.message || "Resume analyzed successfully.");
      setHasResults(true);
    } catch (error) {
      setMessage(
        error instanceof TypeError
          ? "Unable to connect to the backend. Please make sure the Flask server is running."
          : error.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-box">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="resume">Upload Resume</label>
          <input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeChange}
          />
          <p>Supported formats: PDF, DOC, DOCX. Maximum size: 5 MB.</p>
        </div>

        <div className="form-group">
          <label htmlFor="job-description">Job Description</label>
          <textarea
            id="job-description"
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            placeholder="Paste the job description here..."
            rows={6}
          />
          <p>{jobDescription.length} characters entered</p>
        </div>

        <button type="submit" disabled={isUploading}>
          {isUploading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </form>

      {message && <p role="status">{message}</p>}

      {hasResults && (
        <div className="analysis-results">
          {extractedText && (
            <div className="extracted-text">
              <h3>Extracted Resume Text</h3>
              <p>{extractedText}</p>
            </div>
          )}

          <div className="skills-section">
            <h3>Detected Skills</h3>
            {skills.length > 0 ? (
              <div className="skills-list">
                {skills.map((skill) => (
                  <span className="skill-tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="empty-state">
                No skills were detected in your resume.
              </p>
            )}
          </div>

          <div className="skills-section">
            <h3>Required Job Skills</h3>
            {requiredSkills.length > 0 ? (
              <div className="skills-list">
                {requiredSkills.map((skill) => (
                  <span className="skill-tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="empty-state">
                No required skills were identified in the job description.
              </p>
            )}
          </div>

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

          {matchingSkills.length > 0 ? (
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
          ) : (
            <p className="empty-state">
              No matching skills found for this job description.
            </p>
          )}

          {missingSkills.length > 0 ? (
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
          ) : (
            <p className="empty-state">
              No missing skills found. Your detected skills cover all required
              skills!
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default UploadBox;