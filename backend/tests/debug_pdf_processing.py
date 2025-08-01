import os
import sys
import json

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.file_loader import extract_text_from_file
from langchain_chain import extract_invoice_data

def test_pdf_extraction(pdf_path):
    """Test PDF text extraction and processing"""
    print(f"\n{'='*50}")
    print(f"Testing PDF: {os.path.basename(pdf_path)}")
    print(f"{'='*50}")
    
    # 1. Extract text from PDF
    with open(pdf_path, 'rb') as f:
        content = f.read()
    
    print("\n1. Extracted Text:")
    print("-" * 30)
    text = extract_text_from_file(pdf_path, content)
    print(text[:1000] + "..." if len(text) > 1000 else text)  # Print first 1000 chars
    
    # 2. Process with LLM
    print("\n2. Processing with LLM...")
    result = extract_invoice_data(text)
    
    print("\n3. LLM Result:")
    print("-" * 30)
    if isinstance(result, str):
        try:
            # Try to parse if it's a JSON string
            result = json.loads(result)
            print(json.dumps(result, indent=2))
        except json.JSONDecodeError:
            print(result)
    else:
        print(json.dumps(result, indent=2))
    
    return result

if __name__ == "__main__":
    # Test with the generated PDF
    pdf_path = "test_invoice.pdf"
    
    if not os.path.exists(pdf_path):
        print(f"Error: {pdf_path} not found. Please generate it first.")
    else:
        test_pdf_extraction(pdf_path)
