
import { useRef, useState } from "react";

function UploadBox() {
  const fileInputRef = useRef(null);
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  const selectResume = (selectedFile) => {
    setMessage("");
    setMessageType("");
    clearResults();

    if (!selectedFile) return;

    const allowedExtensions = /\.(pdf|docx)$/i;

    if (!allowedExtensions.test(selectedFile.name)) {
      setResume(null);
      setMessage("Please select a PDF or DOCX file.");
      setMessageType("error");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setResume(null);
      setMessage("File size must not exceed 5 MB.");
      setMessageType("error");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setResume(selectedFile);
    setMessage("Your resume is ready for analysis.");
    setMessageType("success");
  };

  const handleResumeChange = (event) => {
    selectResume(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    if (isUploading) return;

    const file = event.dataTransfer.files?.[0];
    if (file) selectResume(file);
  };

  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
    setMessage("");
    setMessageType("");
    clearResults();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!resume) {
      setMessage("Please select your resume first.");
      setMessageType("error");
      return;
    }

    if (!jobDescription.trim()) {
      setMessage("Please enter a job description.");
      setMessageType("error");
      return;
    }

    setIsUploading(true);
    setMessage("Analyzing your resume. This may take a moment...");
    setMessageType("loading");
    clearResults();

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("job_description", jobDescription.trim());

      const response = await fetch(
        "https://ai-resume-analyzer-egsc.onrender.com/api/extract-resume",
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
      setMessageType("success");
      setHasResults(true);
    } catch (error) {
      setMessage(
        error instanceof TypeError
          ? "Unable to connect to the backend. Please try again in a moment."
          : error.message || "Something went wrong. Please try again."
      );
      setMessageType("error");
    } finally {
      setIsUploading(false);
    }
  };

  const renderSkillTags = (skillList, emptyMessage) => {
    if (skillList.length === 0) {
      return <p className="empty-skills">{emptyMessage}</p>;
    }

    return (
      <div className="skills-list">
        {skillList.map((skill, index) => (
          <span className="skill-tag" key={`${skill}-${index}`}>
            {skill}
          </span>
        ))}
      </div>
    );
  };

  const safeScore = Math.min(
    100,
    Math.max(0, Number(matchScore) || 0)
  );

  return (
    <div className="upload-box">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="analyzer-label" htmlFor="resume">
            <span className="step-number">01</span>
            Upload your resume
          </label>

          <div
            className={`resume-dropzone ${isDragging ? "dragging" : ""} ${
              resume ? "has-file" : ""
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              if (!isUploading) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              id="resume"
              className="resume-file-input"
              type="file"
              accept=".pdf,.docx"
              onChange={handleResumeChange}
              disabled={isUploading}
            />

            <div className="upload-icon" aria-hidden="true">
              {resume ? "✓" : "↑"}
            </div>

            <h3>
              {resume ? "Resume ready to analyze" : "Drop your resume here"}
            </h3>

            <p className="dropzone-description">
              {resume
                ? "Your file has passed the initial checks."
                : "Drag and drop your file here, or choose a file from your computer."}
            </p>

            <label
              htmlFor="resume"
              className={`choose-resume-button ${
                isUploading ? "disabled" : ""
              }`}
            >
              {resume ? "Choose another file" : "Browse files"}
            </label>

            {resume && (
              <div className="selected-file-card">
                <span className="file-type-icon">PDF</span>
                <span className="selected-file-name" title={resume.name}>
                  {resume.name}
                  <small>
                    {(resume.size / 1024).toFixed(0)} KB · Ready
                  </small>
                </span>
                <span className="file-check" aria-label="File selected">
                  ✓
                </span>
              </div>
            )}
          </div>

          <p className="field-hint">
            Supported formats: PDF and DOCX · Maximum file size: 5 MB
          </p>
        </div>

        <div className="form-group job-description-group">
          <label className="analyzer-label" htmlFor="job-description">
            <span className="step-number">02</span>
            Job description
          </label>

          <p className="field-hint job-hint">
            Include the role, responsibilities, required skills, and
            qualifications for a more useful comparison.
          </p>

          <textarea
            id="job-description"
            className="job-description-input"
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            placeholder="Paste the job description here..."
            rows={7}
            disabled={isUploading}
          />

          <div className="textarea-footer">
            <span>Be specific for a better skills comparison.</span>
            <span>{jobDescription.length} characters</span>
          </div>
        </div>

        <button
          type="submit"
          className="analyze-button"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <span className="analyzer-spinner" aria-hidden="true" />
              Analyzing your resume...
            </>
          ) : (
            <>
              <span aria-hidden="true">✦</span>
              Analyze Resume
              <span className="button-arrow" aria-hidden="true">
                →
              </span>
            </>
          )}
        </button>

        {message && (
          <p
            className={`analyzer-message ${messageType}`}
            role="status"
            aria-live="polite"
          >
            {messageType === "error" && "⚠ "}
            {messageType === "success" && "✓ "}
            {messageType === "loading" && " "}
            {message}
          </p>
        )}
      </form>

      {hasResults && (
        <div className="analysis-results" aria-live="polite">
          <div className="results-heading">
            <span className="results-eyebrow">YOUR ANALYSIS</span>
            <h3>Resume Analysis Results</h3>
            <p>Here is how your resume aligns with the target role.</p>
          </div>

          <div className="match-score">
            <div className="score-header">
              <div>
                <span className="results-eyebrow">JOB COMPATIBILITY</span>
                <h4>Job Match Score</h4>
              </div>
              <span className="score-badge">AI Analysis</span>
            </div>

            <div className="score-value">
              <span>{safeScore.toFixed(0)}%</span>
              <small>skills match</small>
            </div>

            <div
              className="score-progress"
              role="progressbar"
              aria-label="Job match score"
              aria-valuenow={safeScore}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="score-progress-fill"
                style={{ width: `${safeScore}%` }}
              />
            </div>
          </div>

          <div className="skills-results-grid">
            <div className="skills-section">
              <h4>
                <span className="skill-heading-dot found-dot" />
                Skills Found in Resume ({skills.length})
              </h4>
              {renderSkillTags(skills, "No recognized skills were found.")}
            </div>

            <div className="skills-section">
              <h4>
                <span className="skill-heading-dot required-dot" />
                Required Skills ({requiredSkills.length})
              </h4>
              {renderSkillTags(
                requiredSkills,
                "No recognized skills were found in the job description."
              )}
            </div>

            <div className="skills-section matching-skills">
              <h4>
                <span className="skill-heading-dot matching-dot" />
                Matching Skills ({matchingSkills.length})
              </h4>
              {renderSkillTags(matchingSkills, "No matching skills found.")}
            </div>

            <div className="skills-section missing-skills">
              <h4>
                <span className="skill-heading-dot missing-dot" />
                Skills to Improve ({missingSkills.length})
              </h4>
              {renderSkillTags(
                missingSkills,
                "No missing required skills were found."
              )}
            </div>
          </div>

          <details className="extracted-text-details">
            <summary>View extracted resume text</summary>
            <pre>{extractedText || "No extracted text was returned."}</pre>
          </details>
        </div>
      )}
    </div>
  );
}

export default UploadBox;
