import re


def clean_resume_text(text):
    """
    Clean extracted resume text before NLP processing.

    Args:
        text (str): Raw extracted resume text.

    Returns:
        str: Cleaned resume text.
    """

    if not text:
        return ""

    # Replace multiple spaces and tabs with a single space
    text = re.sub(r"[ \t]+", " ", text)

    # Replace multiple line breaks with a single line break
    text = re.sub(r"\n+", "\n", text)

    # Remove unwanted non-printable characters
    text = re.sub(r"[^\x20-\x7E\n]", "", text)

    # Remove spaces at the beginning and end of each line
    lines = [line.strip() for line in text.split("\n")]

    # Remove empty lines
    lines = [line for line in lines if line]

    # Join the cleaned lines
    cleaned_text = "\n".join(lines)

    return cleaned_text.strip()