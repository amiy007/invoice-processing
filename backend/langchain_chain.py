import os
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import LLMChain

# Load environment variables
load_dotenv()

# Read the prompt template
with open("prompts/invoice_prompt.txt", "r") as f:
    template = f.read()

# Initialize Gemini model
gemini_llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.2,
    max_output_tokens=2048,
)

# Create prompt template
prompt = PromptTemplate(
    input_variables=["invoice_text"],
    template=template
)

# Create chain
chain = LLMChain(
    llm=gemini_llm,
    prompt=prompt,
    verbose=True
)

def extract_invoice_data(text):
    """
    Extract structured data from invoice text using Gemini 2.5 Flash
    
    Args:
        text (str): Raw text extracted from invoice
        
    Returns:
        dict: Structured invoice data
    """
    try:
        result = chain.run(invoice_text=text)
        return result
    except Exception as e:
        print(f"Error processing invoice: {str(e)}")
        return {"error": str(e)}
