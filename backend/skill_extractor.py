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
    """
    Extract known skills while filtering simple learning-intention phrases.
    """
    if not text:
        return []

    skill_keywords = load_skill_keywords()
    detected_skills = set()

    for skills in skill_keywords.values():
        for skill in skills:
            pattern = r"(?<!\w)" + re.escape(skill) + r"(?!\w)"

            for match in re.finditer(pattern, text, re.IGNORECASE):
                # Inspect the text immediately before this skill.
                preceding_text = text[max(0, match.start() - 80):match.start()]

                learning_intention = re.search(
                    r"(?:want to learn|would like to learn|"
                    r"plan to learn|planning to learn|"
                    r"hope to learn|interested in learning|"
                    r"learning)\s*$",
                    preceding_text,
                    re.IGNORECASE,
                )

                if not learning_intention:
                    detected_skills.add(skill)
                    break

    return sorted(detected_skills)