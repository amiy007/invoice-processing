import os
from dotenv import load_dotenv
from langchain_chain import extract_invoice_data

def test_invoice_extraction():
    # Load environment variables
    load_dotenv()
    
    # Test invoice text (replace with actual invoice text for testing)
    test_invoice = """
    INVOICE
    Invoice #: INV-2023-001
    Date: 2023-01-15
    
    From:
    ABC Corporation
    123 Business Rd
    New York, NY 10001
    
    To:
    XYZ Company
    456 Client Ave
    Boston, MA 02108
    
    Description                     Qty    Unit Price    Amount
    ---------------------------------------------------------
    Web Design Services             1       $1,000.00    $1,000.00
    Hosting (Annual)                1         $250.00      $250.00
    
    Subtotal: $1,250.00
    Tax (8%): $100.00
    Total: $1,350.00
    
    Payment due within 30 days.
    Thank you for your business!
    """
    
    print("Testing invoice extraction...")
    result = extract_invoice_data(test_invoice)
    print("\nExtraction Result:")
    print(result)

if __name__ == "__main__":
    test_invoice_extraction()
