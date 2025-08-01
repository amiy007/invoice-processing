# Invoice Processing API Backend

This is the backend service for the Invoice Processing application, built with FastAPI. It provides endpoints for processing invoice files and extracting structured data.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Error Handling](#error-handling)
- [Environment Variables](#environment-variables)
- [License](#license)

## Features
- Process invoice files (PDF, PNG, JPG, DOCX)
- Extract structured data from invoices
- Health check endpoint
- Interactive API documentation
- Input validation
- Error handling

## Prerequisites
- Python 3.8+
- pip (Python package manager)
- Virtual environment (recommended)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd invoice-genai-scanner/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## Running the Application

Start the development server:
```bash
uvicorn main:app --reload --port 8000
```

The server will be available at `http://127.0.0.1:8000`

## API Documentation

### Interactive Documentation
- **Swagger UI**: `http://127.0.0.1:8000/api/docs`
- **ReDoc**: `http://127.0.0.1:8000/api/redoc`
- **OpenAPI Schema**: `http://127.0.0.1:8000/api/openapi.json`

### Available Endpoints

#### 1. Root Endpoint
- **URL**: `GET /`
- **Description**: Basic API information
- **Response**:
  ```json
  {
    "message": "Invoice Processing API is running"
  }
  ```

#### 2. Health Check
- **URL**: `GET /health`
- **Description**: Check if the API is running
- **Response**:
  ```json
  {
    "status": "healthy",
    "version": "1.0.0",
    "timestamp": "2025-08-01T10:43:11Z"
  }
  ```

#### 3. Process Invoice
- **URL**: `POST /api/process-invoice`
- **Description**: Process an invoice file and extract structured data
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `file` (required): The invoice file to process (PDF, PNG, JPG, DOCX)
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
      "vendor_name": "ABC Corporation",
      "invoice_number": "INV-2023-001",
      "date": "2023-01-15",
      "due_date": "2023-02-14",
      "subtotal": 1250.0,
      "tax": 100.0,
      "total": 1350.0,
      "line_items": [
        {
          "description": "Web Design Services",
          "quantity": 1,
          "unit_price": 1000.0,
          "amount": 1000.0
        },
        {
          "description": "Hosting (Annual)",
          "quantity": 1,
          "unit_price": 250.0,
          "amount": 250.0
        }
      ]
    }
  }
  ```
- **Error Response** (Unsupported file type):
  ```json
  {
    "success": false,
    "error": "Unsupported file type. Allowed types: png, docx, pdf, jpeg, jpg",
    "data": null
  }
  ```

## Testing

### Running Tests

1. Make sure you have the development dependencies installed:
   ```bash
   pip install pytest
   ```

2. Run the tests:
   ```bash
   python -m pytest -v test_integration.py
   ```

### Test Coverage

To generate a test coverage report:

```bash
pip install pytest-cov
python -m pytest --cov=. --cov-report=html
```

## Error Handling

The API returns appropriate HTTP status codes and error messages for different scenarios:

- `400 Bad Request`: Missing or invalid request parameters
- `415 Unsupported Media Type`: Unsupported file type
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server-side error

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# API Configuration
API_TITLE=Invoice Processing API
API_DESCRIPTION=API for extracting and processing invoice data using AI
API_VERSION=1.0.0

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# File Upload
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
