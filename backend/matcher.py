def calculate_skill_match(resume_skills, required_skills):
    """
    Compare resume skills with required job skills.

    Args:
        resume_skills (list): Skills detected in the resume.
        required_skills (list): Skills required by the job.

    Returns:
        dict: Matching skills, missing skills, and match percentage.
    """

    resume_set = {skill.lower() for skill in resume_skills}
    required_set = {skill.lower() for skill in required_skills}

    if not required_set:
        return {
            "matching_skills": [],
            "missing_skills": [],
            "match_percentage": 0
        }

    matching_skills = sorted(
        skill for skill in required_skills
        if skill.lower() in resume_set
    )

    missing_skills = sorted(
        skill for skill in required_skills
        if skill.lower() not in resume_set
    )

    match_percentage = round(
        (len(matching_skills) / len(required_skills)) * 100,
        2
    )

    return {
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "match_percentage": match_percentage
    }