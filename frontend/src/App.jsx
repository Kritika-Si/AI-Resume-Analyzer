
import { useEffect, useState } from "react";
import "./App.css";
import UploadBox from "./components/UploadBox";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking backend...");
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    fetch("https://ai-resume-analyzer-egsc.onrender.com/api/health")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }

        return response.json();
      })
      .then((data) => {
        setBackendStatus(data.message);
      })
      .catch(() => {
        setBackendStatus("Backend connection failed. Please try again.");
      });
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const featureDetails = {
    "Resume Parsing": {
      icon: "📄",
      description:
        "Upload your resume in PDF or DOCX format. ResumeAI extracts the text and identifies recognized skills from your resume, helping you understand the skills and experience presented in your profile.",
      benefit:
        "Benefit: Understand which skills your resume contains before applying for a job.",
    },
    "Job Match Score": {
      icon: "🎯",
      description:
        "Enter a job description to compare its recognized required skills with the skills found in your resume. ResumeAI calculates a match percentage based on the skills detected by the system.",
      benefit:
        "Benefit: Get a quick indication of how closely your detected skills match a particular job description.",
    },
    "Missing Skills": {
      icon: "🚀",
      description:
        "ResumeAI identifies recognized skills required by a job description that were not detected in your resume. These results can help you identify areas to learn or experience to highlight more clearly.",
      benefit:
        "Benefit: Understand potential skill gaps and plan your next steps toward job readiness.",
    },
  };

  return (
    <>
      <nav className="navbar">
        <a
          href="#home"
          className="brand"
          onClick={(event) => {
            event.preventDefault();
            scrollToSection("home");
          }}
        >
          ResumeAI
        </a>

        <div className="nav-links">
          <a
            href="#home"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection("home");
            }}
          >
            Home
          </a>

          <a
            href="#features"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection("features");
            }}
          >
            Features
          </a>

          <a
            href="#about"
            onClick={(event) => {
              event.preventDefault();
              scrollToSection("about");
            }}
          >
            About
          </a>
        </div>
      </nav>

      <main>
        
{/* PREMIUM HERO SECTION */}
<section className="hero-premium" id="home">
  <div className="hero-glow hero-glow-top" />
  <div className="hero-glow hero-glow-bottom" />

  <div className="hero-premium-container">
    {/* LEFT CONTENT */}
    <div className="hero-premium-content">
      <div className="hero-eyebrow">
        <span className="hero-eyebrow-dot" />
        AI-POWERED CAREER INTELLIGENCE
      </div>

      <h1>
        See how well
        <br />
        you match.
        <br />
        <span>Land interviews.</span>
      </h1>

      <p className="hero-premium-description">
        Our AI analyzes your resume and the job description
        to calculate your match score, highlight your strengths,
        and show you exactly what to improve.
      </p>

      <div className="hero-benefits">
        <div className="hero-benefit">
          <div className="hero-benefit-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v3M12 20v3M1 12h3M20 12h3" />
            </svg>
          </div>
          <div>
            <h3>Smart Match Scoring</h3>
            <p>Understand how your resume fits a job role.</p>
          </div>
        </div>

        <div className="hero-benefit">
          <div className="hero-benefit-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 17l6-6 4 3 8-9" />
              <path d="M15 5h6v6" />
            </svg>
          </div>
          <div>
            <h3>Actionable Insights</h3>
            <p>Discover missing skills and ways to improve.</p>
          </div>
        </div>

        <div className="hero-benefit">
          <div className="hero-benefit-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="5" y="3" width="14" height="18" rx="2" />
              <path d="M9 8h6M9 12h6M9 16h4" />
            </svg>
          </div>
          <div>
            <h3>Tailored Resume Feedback</h3>
            <p>Get insights based on your target job description.</p>
          </div>
        </div>
      </div>

      <div className="hero-actions">
        <button
          className="hero-primary-button"
          onClick={() =>
            document.getElementById("analyzer")?.scrollIntoView({
              behavior: "smooth"
            })
          }
        >
          Analyze My Resume
          <span aria-hidden="true"> →</span>
        </button>

        <button
          className="hero-secondary-button"
          onClick={() =>
            document.getElementById("features")?.scrollIntoView({
              behavior: "smooth"
            })
          }
        >
          Explore Features
        </button>
      </div>

      <div className="hero-trust-note">
        <span className="hero-trust-check">✓</span>
        Resume insights tailored to your target role
      </div>
    </div>

    {/* RIGHT DASHBOARD PREVIEW */}
    <div className="hero-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-heading">
          <div className="dashboard-logo-icon">↗</div>
          <div>
            <h2>Job Match Analysis</h2>
            <p>Resume insights dashboard</p>
          </div>
        </div>
        <span className="dashboard-live-badge">
          <span /> AI Preview
        </span>
      </div>

      <div className="dashboard-main">
        {/* MATCH SCORE */}
        <div className="dashboard-score-panel">
          <div className="dashboard-panel-title">
            <span className="dashboard-mini-icon">◎</span>
            Match Score
          </div>

          <div className="score-ring">
            <svg viewBox="0 0 180 180" aria-label="Illustrative match score">
              <circle
                className="score-ring-track"
                cx="90"
                cy="90"
                r="76"
              />
              <circle
                className="score-ring-progress"
                cx="90"
                cy="90"
                r="76"
              />
            </svg>

            <div className="score-ring-label">
              <strong>78<span>%</span></strong>
              <small>Good Match</small>
            </div>
          </div>

          <p className="score-description">
            A sample match score showing how resume skills can
            align with a target job.
          </p>

          <div className="score-insight-card">
            <span className="score-insight-arrow">↗</span>
            <div>
              <strong>Improve your match</strong>
              <p>Review missing skills below</p>
            </div>
          </div>
        </div>

        {/* SKILLS PANEL */}
        <div className="dashboard-skills-panel">
          <div className="skills-group">
            <div className="skills-heading">
              <div>
                <span className="skills-status matched">✓</span>
                <h3>Matching Skills</h3>
              </div>
              <span className="skills-count">Skills found</span>
            </div>

            <div className="skill-tags matched-tags">
              {[
                "Python",
                "SQL",
                "React",
                "Flask",
                "Data Analysis",
                "JavaScript",
                "Git",
                "REST APIs"
              ].map((skill) => (
                <span className="skill-tag" key={skill}>
                  {skill} <b>✓</b>
                </span>
              ))}
            </div>
          </div>

          <div className="dashboard-skills-divider" />

          <div className="skills-group">
            <div className="skills-heading">
              <div>
                <span className="skills-status missing">!</span>
                <h3>Skills to Improve</h3>
              </div>
              <span className="skills-count missing-count">
                Suggested
              </span>
            </div>

            <div className="skill-tags missing-tags">
              {[
                "Machine Learning",
                "Docker",
                "Cloud Basics",
                "Testing"
              ].map((skill) => (
                <span className="skill-tag" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD FOOTER */}
      <div className="dashboard-recommendation">
        <div className="recommendation-icon">✦</div>
        <div className="recommendation-copy">
          <strong>Your next improvement</strong>
          <p>
            Compare your resume against a job description to identify
            relevant missing skills.
          </p>
        </div>
        <span className="recommendation-arrow">↗</span>
      </div>

      <div className="dashboard-disclaimer">
        Illustrative dashboard · Sample data
      </div>
    </div>
  </div>
</section>


        <section className="features-section" id="features">
          <div className="section-heading">
            <h2>Features</h2>
            <p>
              Everything you need to understand how your resume matches a job.
            </p>
          </div>

          <div className="features-grid">
            {Object.entries(featureDetails).map(([title, feature]) => (
              <article
                className="feature-card"
                key={title}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                onClick={() => setSelectedFeature(title)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedFeature(title);
                  }
                }}
              >
                <div className="feature-icon">{feature.icon}</div>

                <h3>{title}</h3>

                <p>
                  {title === "Resume Parsing" &&
                    "Extract text and identify skills from your uploaded resume."}

                  {title === "Job Match Score" &&
                    "Compare your resume skills against the requirements of a job."}

                  {title === "Missing Skills" &&
                    "Discover which required skills you may need to learn or demonstrate more clearly in your resume."}
                </p>

                <span className="feature-learn-more">
                  Click to learn more →
                </span>
              </article>
            ))}
          </div>
        </section>

        {selectedFeature && (
          <div
            className="feature-modal-overlay"
            onClick={() => setSelectedFeature(null)}
          >
            <div
              className="feature-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="feature-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="feature-modal-close"
                aria-label="Close description"
                onClick={() => setSelectedFeature(null)}
              >
                ×
              </button>

              <div className="feature-modal-icon">
                {featureDetails[selectedFeature].icon}
              </div>

              <h2 id="feature-modal-title">{selectedFeature}</h2>

              <p>{featureDetails[selectedFeature].description}</p>

              <p className="feature-modal-benefit">
                {featureDetails[selectedFeature].benefit}
              </p>

              <button
                type="button"
                className="feature-modal-button"
                onClick={() => setSelectedFeature(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <section className="analyzer-section" id="analyzer">
          <div className="section-heading">
            <h2>Analyze Your Resume</h2>
            <p>
              Upload your resume and enter a job description to get started.
            </p>
          </div>

          <UploadBox />
        </section>

  <section className="about-section" id="about">
   <div className="about-container">
    <div className="about-hero">
      <div className="about-copy">
        <span className="about-badge">
          ✨ About ResumeAI
        </span>

        <h2>
          About <span>ResumeAI</span>
        </h2>

        <h3>
          Smarter resume analysis. Better career preparation.
        </h3>

        <p className="about-description">
          ResumeAI helps students, freshers, and job seekers
          understand how their skills align with job requirements.
          Upload a resume, explore detected skills, identify skill
          gaps, and get useful insights to prepare more confidently
          for your next opportunity.
        </p>

        <div className="about-highlights">
          <div className="about-highlight">
            <span className="highlight-icon">📄</span>
            <div>
              <strong>Resume Parsing</strong>
              <p>Extract text and identify skills.</p>
            </div>
          </div>

          <div className="about-highlight">
            <span className="highlight-icon">🎯</span>
            <div>
              <strong>Job Matching</strong>
              <p>Compare skills with job needs.</p>
            </div>
          </div>

          <div className="about-highlight">
            <span className="highlight-icon">🚀</span>
            <div>
              <strong>Skill Gap Insights</strong>
              <p>Discover skills to improve.</p>
            </div>
          </div>

          <div className="about-highlight">
            <span className="highlight-icon">🎓</span>
            <div>
              <strong>Career Readiness</strong>
              <p>Prepare for your next role.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-visual">
        <div className="visual-orbit orbit-one"></div>
        <div className="visual-orbit orbit-two"></div>

        <div className="resume-preview">
          <div className="resume-top">
            <div className="resume-avatar">👤</div>
            <div>
              <h3>YOUR RESUME</h3>
              <span className="resume-line short"></span>
            </div>
          </div>

          <div className="resume-label">Skills detected</div>

          <div className="resume-skills">
            <span>Python</span>
            <span>React</span>
            <span>SQL</span>
            <span>CSS</span>
          </div>

          <div className="resume-label">Resume analysis</div>

          <div className="resume-line"></div>
          <div className="resume-line medium"></div>
          <div className="resume-line short"></div>

          <div className="resume-check">✓</div>
        </div>

        <div className="floating-score">
          <span>🎯 Job Match Score</span>
          <div className="score-circle">
            <strong>AI</strong>
          </div>
          <small>Skill comparison</small>
        </div>

        <div className="floating-skills">
          <h4>💡 Skill Insights</h4>
          <p><span>✓</span> Matching skills</p>
          <p><span>!</span> Skills to improve</p>
          <p><span>↗</span> Career growth</p>
        </div>
      </div>
    </div>

    <div className="tech-stack">
      <div className="tech-intro">
        <h3>Built with</h3>
        <p>Technologies powering ResumeAI</p>
      </div>

      <div className="tech-badge">
        <span>⚛️</span> React
      </div>
      <div className="tech-badge">
        <span>⚡</span> Vite
      </div>
      <div className="tech-badge">
        <span>🐍</span> Python
      </div>
      <div className="tech-badge">
        <span>🌶️</span> Flask
      </div>
      <div className="tech-badge">
        <span>🎨</span> CSS
      </div>
    </div>

    <div className="mission-banner">
      <div className="mission-icon">🚀</div>

      <div className="mission-heading">
        <span>OUR MISSION</span>
        <h3>Empowering Your Next Step</h3>
      </div>

      <p>
        Helping every job seeker understand their strengths,
        discover opportunities to improve, and move forward
        with greater confidence.
      </p>

      <button
        className="mission-button"
        onClick={() =>
          document.getElementById("analyzer")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      >
        Start Analyzing <span>→</span>
      </button>
    </div>
  </div>
</section>

      </main>

      <footer className="site-footer">
        <p>ResumeAI — AI Resume Analyzer &amp; Job Match System</p>
        <p>{backendStatus}</p>
      </footer>
    </>
  );
}

export default App;
