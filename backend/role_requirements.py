
ROLE_REQUIREMENTS = {
    "python developer": [
        "Python", "SQL", "Git", "REST API", "Flask",
    ],
    "backend developer": [
        "Python", "SQL", "REST API", "Git", "Flask",
    ],
    "frontend developer": [
        "HTML", "CSS", "JavaScript", "React", "Git",
    ],
    "web developer": [
        "HTML", "CSS", "JavaScript", "React", "REST API",
    ],
    "full stack developer": [
        "HTML", "CSS", "JavaScript", "React",
        "Node.js", "SQL", "REST API", "Git",
    ],
    "data analyst": [
        "Python", "SQL", "Pandas", "Excel",
        "Statistics", "Data Visualization",
    ],
    "data scientist": [
        "Python", "SQL", "Pandas", "NumPy",
        "Statistics", "Machine Learning", "Scikit-learn",
    ],
    "machine learning engineer": [
        "Python", "Machine Learning", "Deep Learning",
        "Scikit-learn", "TensorFlow", "PyTorch",
        "Model Evaluation", "Model Deployment",
    ],
    "ai engineer": [
        "Python", "Artificial Intelligence", "Machine Learning",
        "Deep Learning", "Generative AI",
        "Large Language Models", "PyTorch",
    ],
    "ai and machine learning": [
        "Python", "Artificial Intelligence", "Machine Learning",
        "Deep Learning", "Scikit-learn", "TensorFlow",
        "PyTorch", "NLP",
    ],
    "data engineer": [
        "Python", "SQL", "Apache Spark", "Hadoop",
        "Kafka", "AWS",
    ],
    "devops engineer": [
        "Git", "Docker", "Kubernetes", "AWS",
        "Azure", "Python",
    ],
    "cloud engineer": [
        "AWS", "Azure", "Google Cloud", "Docker",
        "Kubernetes", "Python",
    ],
}


def get_role_requirements(job_role):
    """Return required skills for a recognized job role or keyword."""
    if not isinstance(job_role, str) or not job_role.strip():
        return []

    role = " ".join(job_role.lower().split())

    # First, check for an exact role match.
    if role in ROLE_REQUIREMENTS:
        return ROLE_REQUIREMENTS[role].copy()

    # Then, check whether the entered text contains a known role.
    for known_role, skills in ROLE_REQUIREMENTS.items():
        if known_role in role:
            return skills.copy()

    # Finally, infer skills from supported role-related keywords.
    keyword_groups = {
        "python": ["Python", "SQL", "Git", "REST API"],
        "web": ["HTML", "CSS", "JavaScript", "React", "REST API"],
        "frontend": ["HTML", "CSS", "JavaScript", "React", "Git"],
        "backend": ["Python", "SQL", "REST API", "Git"],
        "full stack": [
            "HTML", "CSS", "JavaScript", "React",
            "Node.js", "SQL", "REST API",
        ],
        "data analysis": [
            "Python", "SQL", "Pandas", "Excel", "Data Visualization",
        ],
        "data science": [
            "Python", "Pandas", "NumPy", "Statistics",
            "Machine Learning", "Scikit-learn",
        ],
        "machine learning": [
            "Python", "Machine Learning", "Scikit-learn",
            "Deep Learning", "TensorFlow", "PyTorch",
        ],
        "artificial intelligence": [
            "Python", "Artificial Intelligence", "Machine Learning",
            "Deep Learning", "Generative AI",
        ],
        "generative ai": [
            "Python", "Generative AI", "Large Language Models",
            "NLP", "Machine Learning",
        ],
        "rag": [
            "Python", "Generative AI", "Large Language Models",
            "NLP", "REST API",
        ],
    }

    for keyword, skills in keyword_groups.items():
        if keyword in role:
            return skills.copy()

    return []
