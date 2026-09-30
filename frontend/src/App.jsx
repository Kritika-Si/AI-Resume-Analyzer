import { useEffect, useState } from "react";
import "./App.css";
import UploadBox from "./components/UploadBox";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking backend...");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/health")
      .then((response) => response.json())
      .then((data) => {
        setBackendStatus(data.message);
      })
      .catch(() => {
        setBackendStatus("Backend connection failed");
      });
  }, []);

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

          <p className="backend-status">
            Backend Status: {backendStatus}
          </p>
        </div>
      </section>

      <UploadBox />
    </>
  );
}

export default App;