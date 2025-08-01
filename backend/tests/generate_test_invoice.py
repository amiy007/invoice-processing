from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepInFrame
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportba.lib import colors
from reportlab.lib.units import inch
from datetime import datetime, timedelta
import json

def create_test_invoice():
    # Create a PDF document
    doc = SimpleDocTemplate("test_invoice.pdf", pagesize=letter)
    
    # Create styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('Title', parent=styles['Title'], fontSize=24, spaceAfter=30)
    heading_style = ParagraphStyle('Heading2', parent=styles['Heading2'], fontSize=14, spaceAfter=12)
    normal_style = ParagraphStyle('Normal', parent=styles['Normal'], fontSize=12, leading=14)
    bold_style = ParagraphStyle('Bold', parent=normal_style, fontName='Helvetica-Bold')
    
    # Create content
    content = []
    
    # Add title and invoice info
    content.append(Paragraph("<b>INVOICE</b>", title_style))
    
    # Invoice metadata in a table for better structure
    invoice_number = f"INV-{datetime.now().strftime('%Y%m%d')}-001"
    invoice_date = (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d")
    due_date = (datetime.now() + timedelta(days=25)).strftime("%Y-%m-%d")
    currency = "USD"
    
    # Create a structured invoice data dictionary
    invoice_data = {
        "invoice_number": invoice_number,
        "vendor_name": "ABC Corporation",
        "invoice_date": invoice_date,
        "due_date": due_date,
        "currency": currency,
        "line_items": [
            {
                "description": "Web Design Services",
                "quantity": 1,
                "unit_price": 1000.00,
                "total_price": 1000.00
            },
            {
                "description": "Hosting (Annual)",
                "quantity": 1,
                "unit_price": 250.00,
                "total_price": 250.00
            }
        ]
    }
    
    # Calculate totals
    subtotal = sum(item["total_price"] for item in invoice_data["line_items"])
    tax = subtotal * 0.08  # 8% tax
    total = subtotal + tax
    
    # Add invoice metadata
    meta_data = [
        ["Invoice Number:", invoice_data["invoice_number"]],
        ["Invoice Date:", invoice_data["invoice_date"]],
        ["Due Date:", invoice_data["due_date"]],
        ["Currency:", invoice_data["currency"]]
    ]
    
    meta_table = Table(meta_data, colWidths=[1.5*inch, 3.5*inch])
    meta_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (0, -1), 0),
        ('LEFTPADDING', (0, 0), (0, -1), 0),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
    ]))
    
    content.append(meta_table)
    content.append(Spacer(1, 20))
    
    # Add from/to sections side by side
    from_to_data = [
        [
            Paragraph("<b>From:</b>", normal_style),
            Paragraph("<b>To:</b>", normal_style)
        ],
        [
            Paragraph("ABC Corporation<br/>123 Business Rd<br/>New York, NY 10001", normal_style),
            Paragraph("XYZ Company<br/>456 Client Ave<br/>Boston, MA 02108", normal_style)
        ]
    ]
    
    from_to_table = Table(from_to_data, colWidths=[3*inch, 3*inch])
    from_to_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
    ]))
    
    content.append(from_to_table)
    content.append(Spacer(1, 10))
    
    # Add line items header
    content.append(Paragraph("<b>Line Items:</b>", heading_style))
    
    # Prepare line items data
    line_items = [
        ["Description", "Qty", f"Unit Price ({currency})", f"Amount ({currency})"]]
    
    for item in invoice_data["line_items"]:
        line_items.append([
            item["description"],
            str(item["quantity"]),
            f"{item['unit_price']:.2f}",
            f"{item['total_price']:.2f}"
        ])
    
    # Create line items table
    line_items_table = Table(
        line_items, 
        colWidths=[3*inch, 1*inch, 1.5*inch, 1.5*inch],
        repeatRows=1
    )
    
    line_items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#404040')),  # Darker header
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8f9fa')),  # Light gray
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#dee2e6')),  # Lighter grid
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    content.append(line_items_table)
    content.append(Spacer(1, 20))
    
    # Add totals
    totals = [
        ["", "", "<b>Subtotal:</b>", f"{subtotal:.2f} {currency}"],
        ["", "", "<b>Tax (8%):</b>", f"{tax:.2f} {currency}"],
        ["", "", "<b>Total:</b>", f"<b>{total:.2f} {currency}</b>"]
    ]
    
    totals_table = Table(totals, colWidths=[3*inch, 1*inch, 1.5*inch, 1.5*inch])
    totals_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (2, 0), (2, -1), 0),
        ('RIGHTPADDING', (2, 0), (2, -1), 10),
    ]))
    
    content.append(totals_table)
    content.append(Spacer(1, 30))
    
    # Add payment terms and footer
    payment_terms = [
        "<b>Payment Terms:</b>",
        "• Payment due within 30 days of invoice date",
        "• Please include the invoice number in your payment",
        "• Bank transfer details available upon request",
        "",
        "<i>Thank you for your business!</i>"
    ]
    
    for term in payment_terms:
        content.append(Paragraph(term, normal_style))
    
    # Add a JSON representation of the invoice data as hidden text
    # This helps with testing and debugging
    json_data = json.dumps(invoice_data, indent=2)
    content.append(Spacer(1, 20))
    content.append(Paragraph("<font size='1' color='white'>{}</font>".format(json_data), normal_style))
    
    # Build the PDF with metadata
    doc.build(content, 
             onFirstPage=None,
             onLaterPages=None,
             canvasmaker=None)
             
    print("Test invoice generated: test_invoice.pdf")
    
    # Also save the JSON data for reference
    with open("test_invoice_data.json", "w") as f:
        json.dump(invoice_data, f, indent=2)
    print("Test invoice data saved to: test_invoice_data.json")

if __name__ == "__main__":
    create_test_invoice()
