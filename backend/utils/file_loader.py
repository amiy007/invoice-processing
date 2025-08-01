import pdfplumber
import pytesseract
from PIL import Image
import io
from docx import Document

def extract_text_from_file(filename, content):
    if filename.endswith(".pdf"):
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            return "\n".join(page.extract_text() or "" for page in pdf.pages)
    elif filename.endswith((".jpg", ".jpeg", ".png")):
        image = Image.open(io.BytesIO(content))
        return pytesseract.image_to_string(image)
    elif filename.endswith(".docx"):
        doc = Document(io.BytesIO(content))
        return "\n".join(p.text for p in doc.paragraphs)
    else:
        return "Unsupported file type."
