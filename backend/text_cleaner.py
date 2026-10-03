import re


def clean_resume_text(text):
    """
    Clean and normalize extracted resume text.

    Args:
        text (str): Raw extracted resume text.

    Returns:
        str: Cleaned resume text.
    """

    if not text:
        return ""

    # Normalize different types of line breaks
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # Remove unwanted non-printable characters
    text = re.sub(r"[^\x20-\x7E\t\n]", "", text)

    # Replace multiple spaces and tabs with a single space
    text = re.sub(r"[ \t]+", " ", text)

    # Remove spaces around line breaks
    text = re.sub(r"[ \t]*\n[ \t]*", "\n", text)

    # Remove excessive blank lines
    text = re.sub(r"\n{2,}", "\n", text)

    # Clean each individual line
    lines = [line.strip() for line in text.split("\n")]

    # Remove empty lines
    lines = [line for line in lines if line]

    # Join the cleaned lines
    cleaned_text = "\n".join(lines)

    return cleaned_text.strip()