def calculate_skill_match(resume_skills, required_skills):
    """
    Compare resume skills with required job skills.

    Returns matching skills, missing skills, and match percentage.
    """

    resume_set = {
        skill.strip().lower()
        for skill in resume_skills
        if isinstance(skill, str) and skill.strip()
    }

    # Remove duplicate required skills while preserving their original names.
    unique_required = {}
    for skill in required_skills:
        if isinstance(skill, str) and skill.strip():
            normalized = skill.strip().lower()
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