
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
        <section className="hero" id="home">
          <div className="hero-text">
            <h1>AI Resume Analyzer &amp; Job Match System</h1>

            <p>
              Upload your resume, compare it with a job description,
              discover missing skills, and improve your placement readiness.
            </p>

            <button onClick={() => scrollToSection("analyzer")}>
              Get Started
            </button>
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
