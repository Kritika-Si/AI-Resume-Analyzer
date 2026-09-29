import "./App.css";

function App() {
  return (
    <>
      <nav className="navbar">
        <h2>ResumeAI</h2>

        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">About</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-text">
          <h1>AI Resume Analyzer & Job Match System</h1>

          <p>
            Upload your resume, compare it with a job description,
            discover missing skills, and improve your placement readiness.
          </p>

          <button>Get Started</button>
        </div>
      </section>
    </>
  );
}

export default App;