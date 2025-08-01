import os
import requests
import json

def test_pdf_invoice_processing():
    """Test processing the generated PDF invoice"""
    # Backend server URL
    base_url = "http://127.0.0.1:8000"
    
    # Path to the generated test invoice
    pdf_path = "test_invoice.pdf"
    
    # Verify the PDF file exists
    if not os.path.exists(pdf_path):
        print(f"Error: {pdf_path} not found. Please generate the test invoice first.")
        return False
    
    print(f"Testing PDF invoice processing with: {pdf_path}")
    
    try:
        # Send the PDF to the backend for processing
        with open(pdf_path, 'rb') as f:
            files = {'file': (os.path.basename(pdf_path), f, 'application/pdf')}
            response = requests.post(
                f"{base_url}/api/process-invoice",
                files=files
            )
        
        # Print the response
        print("\nResponse Status Code:", response.status_code)
        print("Response Headers:", dict(response.headers))
        
        try:
            response_data = response.json()
            print("\nResponse JSON:")
            print(json.dumps(response_data, indent=2))
            
            # Basic validation of the response
            if response.status_code == 200 and isinstance(response_data, dict):
                if response_data.get('success') == True:
                    print("\n✅ Successfully processed the invoice!")
                    print("Extracted data:")
                    data = response_data.get('data', {})
                    for key, value in data.items():
                        if key != 'line_items':
                            print(f"- {key}: {value}")
                    if 'line_items' in data and isinstance(data['line_items'], list):
                        print(f"- Found {len(data['line_items'])} line items")
                    return True
                else:
                    print("\n❌ Failed to process invoice:")
                    print(response_data.get('error', 'Unknown error'))
            else:
                print("\n❌ Unexpected response format:")
                print(response.text)
                
        except ValueError as e:
            print("\n❌ Failed to parse JSON response:")
            print(response.text)
            
    except Exception as e:
        print(f"\n❌ Error during request: {str(e)}")
    
    return False

if __name__ == "__main__":
    test_pdf_invoice_processing()
