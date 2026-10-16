
def normalize_skill(skill):
    """Normalize skill names and common aliases."""
    normalized = " ".join(skill.strip().lower().split())

    aliases = {
        "spark": "apache spark",
        "nlp": "natural language processing",
        "ml": "machine learning",
        "scikit learn": "scikit-learn",
        "scikitlearn": "scikit-learn",
        "sklearn": "scikit-learn",
        "react.js": "react",
        "reactjs": "react",
        "node.js": "node.js",
        "nodejs": "node.js",
        "rest apis": "rest api",
        "restful api": "rest api",
        "restful apis": "rest api",
        "amazon web services": "aws",
        "google cloud platform": "google cloud",
        "gcp": "google cloud",
        "postgres": "postgresql",
        "postgre sql": "postgresql",
        "mongo": "mongodb",
        "tf": "tensorflow",
        "js": "javascript",
    }

    return aliases.get(normalized, normalized)


def calculate_skill_match(resume_skills, required_skills):
    """
    Compare resume skills with required job skills.

    Duplicate and equivalent required skills count only once.
    Returns matching skills, missing skills, and match percentage.
    """
    resume_set = {
        normalize_skill(skill)
        for skill in resume_skills
        if isinstance(skill, str) and skill.strip()
    }

    unique_required = {}

    for skill in required_skills:
        if isinstance(skill, str) and skill.strip():
            normalized = normalize_skill(skill)
            unique_required.setdefault(normalized, skill.strip())

    if not unique_required:
        return {
            "matching_skills": [],
            "missing_skills": [],
            "match_percentage": 0,
            "match_score": 0,
        }

    matching_skills = sorted(
        original
        for normalized, original in unique_required.items()
        if normalized in resume_set
    )

    missing_skills = sorted(
        original
        for normalized, original in unique_required.items()
        if normalized not in resume_set
    )

    match_percentage = round(
        len(matching_skills) / len(unique_required) * 100,
        2,
    )

    return {
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "match_percentage": match_percentage,
        "match_score": match_percentage,
    }
