
import json
import os
import re


def load_skill_keywords():
    """Load skill keywords from the JSON file."""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_path = os.path.join(base_dir, "models", "skill_keywords.json")

    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


def extract_skills(text):
    """Extract recognized skills without matching inside larger words."""
    if not text:
        return []

    skill_keywords = load_skill_keywords()
    detected_skills = set()

    # Match longer skill names first to handle overlapping keywords.
    all_skills = {
        skill
        for skills in skill_keywords.values()
        for skill in skills
    }

    sorted_skills = sorted(all_skills, key=len, reverse=True)

    for skill in sorted_skills:
        pattern = r"(?<!\w)" + re.escape(skill) + r"(?!\w)"

        for match in re.finditer(pattern, text, re.IGNORECASE):
            preceding_text = text[max(0, match.start() - 100):match.start()]

            learning_intention = re.search(
                r"(?:want to learn|would like to learn|"
                r"plan to learn|planning to learn|"
                r"hope to learn|interested in learning|"
                r"learning|no longer use|don't use|do not use|"
                r"not using|stopped using|not familiar with|"
                r"unfamiliar with)\s*$",
                preceding_text,
                re.IGNORECASE,
            )

            if not learning_intention:
                detected_skills.add(skill)
                break

    return sorted(detected_skills, key=str.lower)
