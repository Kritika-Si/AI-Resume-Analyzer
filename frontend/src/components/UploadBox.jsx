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

    const allowedExtensions = /\.(pdf|docx)$/i;

    if (!allowedExtensions.test(selectedFile.name)) {
      setMessage("Please select a PDF or DOCX file.");
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

  const renderSkillTags = (skillList, emptyMessage) => {
    if (skillList.length === 0) {
      return <p>{emptyMessage}</p>;
    }

    return (
      <div className="skills-list">
        {skillList.map((skill) => (
          <span className="skill-tag" key={skill}>
            {skill}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="upload-box">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          
<label htmlFor="resume">Upload Resume</label>


<div className="custom-file-picker">
  <input
    id="resume"
    className="resume-file-input"
    type="file"
    accept=".pdf,.docx"
    onChange={handleResumeChange}
    disabled={isUploading}
  />

  <label
    htmlFor="resume"
    className={`choose-resume-button ${isUploading ? "disabled" : ""}`}
  >
    Choose Resume
  </label>

  <span className="selected-file-name" title={resume?.name || ""}>
    {resume ? resume.name : "No resume selected"}
  </span>
</div>


<p>Supported formats: PDF and DOCX. Maximum size: 5 MB.</p>

        </div>

        <div className="form-group">
          <label htmlFor="job-description">Job Description</label>
          <textarea
            id="job-description"
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            placeholder="Paste the job description here..."
            rows={6}
            disabled={isUploading}
          />
        </div>

        <button type="submit" disabled={isUploading}>
          {isUploading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {message && (
          <p role="status" aria-live="polite">
            {message}
          </p>
        )}
      </form>

      {hasResults && (
        <div className="analysis-results">
          <h3>Resume Analysis Results</h3>

          <div className="match-score">
  <h4>Job Match Score</h4>
  <p>{matchScore}%</p>

  <div
    className="score-progress"
    role="progressbar"
    aria-label="Job match score"
    aria-valuenow={Math.min(100, Math.max(0, Number(matchScore) || 0))}
    aria-valuemin={0}
    aria-valuemax={100}
  >
    <div
      className="score-progress-fill"
      style={{
        width: `${Math.min(100, Math.max(0, Number(matchScore) || 0))}%`,
      }}
    />
  </div>
</div>

          <div className="skills-section">
            <h4>Skills Found in Resume ({skills.length})</h4>
            {renderSkillTags(skills, "No recognized skills were found.")}
          </div>

          <div className="skills-section">
            <h4>Required Skills ({requiredSkills.length})</h4>
            {renderSkillTags(
              requiredSkills,
              "No recognized skills were found in the job description."
            )}
          </div>

          <div className="skills-section matching-skills">
            <h4>Matching Skills ({matchingSkills.length})</h4>
            {renderSkillTags(matchingSkills, "No matching skills found.")}
          </div>

          <div className="skills-section missing-skills">
            <h4>Missing Skills ({missingSkills.length})</h4>
            {renderSkillTags(
              missingSkills,
              "No missing required skills were found."
            )}
          </div>

          <details>
            <summary>View Extracted Resume Text</summary>
            <pre>{extractedText}</pre>
          </details>
        </div>
      )}
    </div>
  );
}

export default UploadBox;