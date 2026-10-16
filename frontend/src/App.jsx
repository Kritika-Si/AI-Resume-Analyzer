
import { useEffect, useState } from "react";
import "./App.css";
import UploadBox from "./components/UploadBox";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking backend...");

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
          <a href="#home" onClick={(event) => {
            event.preventDefault();
            scrollToSection("home");
          }}>
            Home
          </a>

          <a href="#features" onClick={(event) => {
            event.preventDefault();
            scrollToSection("features");
          }}>
            Features
          </a>

          <a href="#about" onClick={(event) => {
            event.preventDefault();
            scrollToSection("about");
          }}>
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
            <article className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Resume Parsing</h3>
              <p>
                Extract text and identify skills from your uploaded resume.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Job Match Score</h3>
              <p>
                Compare your resume skills against the requirements of a job.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Missing Skills</h3>
              <p>
                Discover which required skills you may need to learn or
                demonstrate more clearly in your resume.
              </p>
            </article>
          </div>
        </section>

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
          <div className="about-content">
            <h2>About ResumeAI</h2>
            <p>
              ResumeAI is a resume analysis and job-matching project designed
              to help job seekers identify relevant skills, understand gaps,
              and prepare more effectively for job opportunities.
            </p>
            <p>
              It combines resume text extraction, skill detection, and
              job-description comparison in one simple interface.
            </p>
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
