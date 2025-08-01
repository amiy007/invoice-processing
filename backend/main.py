import os
import time
from typing import Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import local modules
from langchain_chain import extract_invoice_data
from utils.file_loader import extract_text_from_file

# Constants
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "docx"}

# Initialize FastAPI
app = FastAPI(
    title="Invoice Processing API",
    description="API for extracting and processing invoice data using AI",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class HealthCheckResponse(BaseModel):
    status: str = Field(..., example="healthy")
    version: str = Field(..., example="1.0.0")
    timestamp: str = Field(..., example="2023-01-01T00:00:00Z")

class InvoiceResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

# Helper functions
def get_file_extension(filename: str) -> str:
    return filename.split(".")[-1].lower()

# Endpoints
@app.get("/", include_in_schema=False)
async def root():
    return {"message": "Invoice Processing API is running"}

@app.get("/health", response_model=HealthCheckResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint to verify the API is running
    """
    return {
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

@app.post("/api/process-invoice", response_model=InvoiceResponse, tags=["Invoices"])
async def process_invoice(file: UploadFile = File(...)):
    """
    Process an invoice file and extract structured data
    
    - **file**: Invoice file (PDF, PNG, JPG, DOCX)
    """
    try:
        # Validate file size
        file.file.seek(0, 2)  # Move to end of file
        file_size = file.file.tell()
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File too large. Max size is {MAX_FILE_SIZE/1024/1024}MB"
            )
        file.file.seek(0)  # Reset file pointer
        
        # Validate file extension
        file_extension = get_file_extension(file.filename)
        if file_extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        
        # Read and process file
        content = await file.read()
        text = extract_text_from_file(file.filename, content)
        
        if not text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not extract text from the provided file"
            )
            
        # Extract structured data
        structured_data = extract_invoice_data(text)
        
        return {
            "success": True,
            "data": structured_data
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing invoice: {str(e)}"
        )

# Exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "data": None
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Internal server error",
            "data": None
        }
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize services when the application starts"""
    # Verify required environment variables
    if not os.getenv("GOOGLE_API_KEY"):
        raise RuntimeError("GOOGLE_API_KEY environment variable is not set")
