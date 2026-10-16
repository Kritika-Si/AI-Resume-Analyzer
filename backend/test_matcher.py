
from matcher import normalize_skill, calculate_skill_match


def test_skill_aliases():
    assert normalize_skill("ReactJS") == "react"
    assert normalize_skill("React.js") == "react"
    assert normalize_skill("NLP") == "natural language processing"
    assert normalize_skill("GCP") == "google cloud"
    assert normalize_skill("ML") == "machine learning"
    assert normalize_skill("sklearn") == "scikit-learn"
    assert normalize_skill("NodeJS") == "node.js"
    assert normalize_skill("Postgres") == "postgresql"
    assert normalize_skill("  PYTHON   ") == "python"

def test_perfect_match():
    result = calculate_skill_match(
        ["Python", "ReactJS", "SQL"],
        ["Python", "React", "SQL"],
    )

    assert result["match_percentage"] == 100
    assert len(result["matching_skills"]) == 3
    assert result["missing_skills"] == []


def test_partial_match():
    result = calculate_skill_match(
        ["Python"],
        ["Python", "Machine Learning"],
    )

    assert result["match_percentage"] == 50
    assert result["matching_skills"] == ["Python"]
    assert result["missing_skills"] == ["Machine Learning"]


def test_duplicate_required_skills():
    result = calculate_skill_match(
        ["Python"],
        ["Python", "Python"],
    )

    assert result["match_percentage"] == 100
    assert result["matching_skills"] == ["Python"]


def test_empty_required_skills():
    result = calculate_skill_match(["Python"], [])

    assert result["match_percentage"] == 0
    assert result["matching_skills"] == []
    assert result["missing_skills"] == []


print("Running skill-matcher tests...")

test_skill_aliases()
test_perfect_match()
test_partial_match()
test_duplicate_required_skills()
test_empty_required_skills()

print("All 5 skill-matcher tests passed!")
