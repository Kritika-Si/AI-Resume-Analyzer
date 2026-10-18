# AI Resume Analyzer & Job Match System

A full-stack web application that analyzes a resume against a target job description. It extracts resume text, identifies skills, compares them with job requirements, and displays a job-match score.

**Live Application:** https://ai-resume-analyzer-jade-tau.vercel.app/  
**GitHub Repository:** https://github.com/Kritika-Si/AI-Resume-Analyzer

## Features

- **Resume Upload:** Upload a resume through the web interface.
- **Resume Text Extraction:** Process resume content for analysis.
- **Skill Identification:** Display skills found in the uploaded resume.
- **Job Description Matching:** Compare resume skills with the skills required for a target role.
- **Match Score:** Display resume compatibility as a circular percentage score.
- **Required Skills:** Show skills relevant to the target job.
- **Input Validation:** Validate uploads and provide feedback for common input problems.
- **Modern UI:** Dark-themed interface built with React and CSS.
- **Live Deployment:** Frontend and backend hosted separately.

> The match score is an automated indicator based on the application's matching logic. It is guidance, not a guarantee of hiring outcomes.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Python, Flask |
| Resume Processing | Python-based parsing, text cleaning, and skill extraction |
| Version Control | Git, GitHub |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

## Application Links

- **Live Website:** https://ai-resume-analyzer-jade-tau.vercel.app/
- **Backend Service:** https://ai-resume-analyzer-egsc.onrender.com
- **GitHub Repository:** https://github.com/Kritika-Si/AI-Resume-Analyzer

## How It Works

1. Open the application.
2. Upload a resume.
3. Provide the job description or target-role information requested by the interface.
4. The frontend sends the input to the Flask backend.
5. The backend processes the resume text, identifies skills, and compares them with job requirements.
6. The interface displays the match score, skills found in the resume, and required skills.

The results depend on the resume content and the job description provided.

## Installation and Local Setup

### Prerequisites

Install the following:

- Git
- Python 3.12 or the Python version supported by the project dependencies
- Node.js and npm

### 1. Clone the Repository

Open PowerShell and run:

```powershell
git clone https://github.com/Kritika-Si/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer
```

### 2. Set Up the Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

Keep the backend terminal running while using the application.

### 3. Set Up the Frontend

Open a second PowerShell terminal in the repository root and run:

```powershell
cd frontend
npm install
npm run dev
```

Vite will display a local development URL in the terminal, commonly `http://localhost:5173`. Open that URL in your browser.

If the frontend uses a configured backend URL, make sure it points to your local Flask server during local development. Do not commit secret keys or private environment values.

## Project Structure

The following is a simplified view of the main files:

```text
AI-Resume-Analyzer/
├── backend/
│   ├── app.py
│   ├── resume_parser.py
│   ├── text_cleaner.py
│   ├── skill_extractor.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── UploadBox.jsx
│   │   └── App.css
│   └── package.json
└── README.md
```

Other project files and configuration may also be present.

## Testing Checklist

- Upload a valid resume and confirm that analysis succeeds.
- Try different job descriptions and check that results update.
- Test unsupported files and invalid or empty inputs.
- Confirm that the deployed frontend communicates correctly with the deployed backend.

## Limitations

- Matching depends on the configured skill list and matching logic.
- Resume layout and file format can affect text extraction quality.
- The match score is approximate and does not replace recruiter judgment.
- Avoid uploading confidential personal information unless you are comfortable with the service's privacy practices.

## Future Improvements

- Semantic matching between resumes and job descriptions.
- Explanations of why a match score was assigned.
- Suggestions for improving resume bullet points.
- Automated tests for parsing, validation, and API behavior.
- Further accessibility and usability testing.

## Author

**Kritika Kumari**

GitHub: https://github.com/Kritika-Si

---

If you find this project useful, explore the repository and try the live application.
