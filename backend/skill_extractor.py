import json
import os
import re


def load_skill_keywords():
    """
    Load skill keywords from the JSON file.
    """

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_path = os.path.join(base_dir, "models", "skill_keywords.json")

    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


def extract_skills(text):
    """
    Extract known skills from resume text.

    Args:
        text (str): Cleaned resume text.

    Returns:
        list: List of detected skills.
    """

    if not text:
        return []

    skill_keywords = load_skill_keywords()

    detected_skills = set()

    for skills in skill_keywords.values():
        for skill in skills:
            pattern = r"(?<!\w)" + re.escape(skill) + r"(?!\w)"

            if re.search(pattern, text, re.IGNORECASE):
                detected_skills.add(skill)

    return sorted(detected_skills)