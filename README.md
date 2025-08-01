# Invoice Processing with GenAI

An intelligent invoice processing system that extracts and analyzes invoice data using AI and LLMs.

## Features

- Upload and process various invoice formats (PDF, images, documents)
- AI-powered data extraction using LangChain and OpenAI
- Structured data output in JSON format
- Web-based interface for easy interaction

## Project Structure

```
invoice-genai-scanner/
├── backend/               # FastAPI backend
│   ├── models/           # Data models and schemas
│   ├── utils/            # Utility functions
│   ├── prompts/          # LLM prompt templates
│   ├── main.py           # FastAPI application
│   └── requirements.txt  # Python dependencies
└── frontend/             # React frontend
```

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 16+
- UV (for dependency management)
- Tesseract OCR (for image processing)

### Backend Setup

1. Create and activate virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   cd backend
   uv pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your OpenAI API key and other settings
   ```

4. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

- `POST /api/upload` - Upload and process an invoice
- `GET /api/status/{job_id}` - Check processing status
- `GET /api/results/{job_id}` - Get processed results

## Development

- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

## License

MIT
# invoice-processing
