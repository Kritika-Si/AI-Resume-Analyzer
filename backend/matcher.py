def normalize_skill(skill):
    """Normalize known aliases so equivalent skills are counted once."""
    normalized = skill.strip().lower()

    aliases = {
        "spark": "apache spark",
        "nlp": "natural language processing",
        "scikit learn": "scikit-learn",
        "scikitlearn": "scikit-learn",
    }

    return aliases.get(normalized, normalized)


def calculate_skill_match(resume_skills, required_skills):
    """
    Compare resume skills with required job skills.

    Equivalent skill aliases are counted only once.
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

    match_percentage = max(0, min(100, match_percentage))

    return {
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "match_percentage": match_percentage,
        "match_score": match_percentage,
    }