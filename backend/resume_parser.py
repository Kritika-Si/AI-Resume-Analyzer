from pypdf import PdfReader
from docx import Document


def extract_text_from_pdf(file_path):
    """
    Extract text from a PDF resume.

    Args:
        file_path (str): Path to the PDF file.

    Returns:
        str: Extracted text from the PDF.
    """
    reader = PdfReader(file_path)

    extracted_text = []

    for page in reader.pages:
        text = page.extract_text()

        if text:
            extracted_text.append(text)

    return "\n".join(extracted_text).strip()


def extract_text_from_docx(file_path):
    """
    Extract text from a DOCX resume.

    Args:
        file_path (str): Path to the DOCX file.

    Returns:
        str: Extracted text from the DOCX.
    """
    document = Document(file_path)

    extracted_text = []

    for paragraph in document.paragraphs:
        text = paragraph.text.strip()

        if text:
            extracted_text.append(text)

    return "\n".join(extracted_text).strip()