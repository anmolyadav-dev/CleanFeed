from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFacePipeline
from transformers import pipeline
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List, Optional
import PIL.Image
from google import genai

load_dotenv()

class Req(BaseModel):
    query: Optional[str] = None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
db = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)

generator = pipeline("text-generation", model="23aryangupta/Llama-3.2-3B-Instruct-hate_speech")
llm = HuggingFacePipeline(pipeline=generator)

severity_map = {
    "none": 1,
    "low": 25,
    "medium": 50,
    "high": 80,
    "critical": 99
}

sensitivity_map = {
    "none": 0,
    "low": 20,
    "medium": 52,
    "high": 85,
    "critical": 98
}

def analyze_text(query):
    retrieved_docs = db.similarity_search(query, k=2)
    context = "\n".join([doc.page_content for doc in retrieved_docs])

    response = generator(
        f"Analyze the following content for policy violations based on these YouTube Guidelines:\n"
        f"{context}\n\n"
        f"Return details in this format:\n"
        f"Violation Type: <type or 'None'>\n"
        f"Specific Guideline Violated: <guideline or 'None'>\n"
        f"Severity Level: <none/low/medium/high/critical>\n"
        f"Sensitivity Level: <none/low/medium/high/critical>\n"
        f"Explanation: <detailed explanation or 'No violation detected'>\n"
        f"Recommended Action: <action or 'No action required'>\n"
        f"Content: {query}",
        max_length=1000,
        do_sample=True,
        temperature=0.7
    )

    generated_text = response[0]["generated_text"]
    def extract_moderation_details(text):
        violation_type = "None"
        guideline_violated = "None"
        severity = "none"
        sensitivity = "none"
        explanation = "No violation detected."
        recommended_action = "No action required."

        lines = text.split("\n")
        for line in lines:
            if "Violation Type:" in line:
                violation_type = line.split(":", 1)[1].strip()
            elif "Specific Guideline Violated:" in line:
                guideline_violated = line.split(":", 1)[1].strip()
            elif "Severity Level:" in line:
                severity = line.split(":", 1)[1].strip().lower()
            elif "Sensitivity Level:" in line:
                sensitivity = line.split(":", 1)[1].strip().lower()
            elif "Explanation:" in line:
                explanation = line.split(":", 1)[1].strip()
            elif "Recommended Action:" in line:
                recommended_action = line.split(":", 1)[1].strip()

        severity_percentage = severity_map.get(severity, "Unknown")
        sensitivity_percentage = sensitivity_map.get(sensitivity, "Unknown")
        return {
            "type":"text",
            "original_content": query,
            "guideline_violated": guideline_violated,
            "severity_label": severity.capitalize(),
            "severity_percentage": f"{severity_percentage}%",
            "sensitivity_label": sensitivity.capitalize(),
            "sensitivity_percentage": f"{sensitivity_percentage}%",
            "explanation": explanation,
            "recommended_action": recommended_action,
            "retrieved_context": context
        }

    return extract_moderation_details(generated_text)

def analyze_image(image: UploadFile):
    class Violation(BaseModel):
        guideline_name: str

    class ContentAnalysis(BaseModel):
        violations: List[Violation]
        overall_severity_percentage: int
        severity_label: str
        severity_percentage: int
        sensitivity_label: str
        sensitivity_percentage: int
        explanation: str
        recommended_action: str
    img = PIL.Image.open(image.file)
    client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            "Analyze this image for social media violations. Detect hate speech, nudity, violence, misleading info.",
            img
        ],
        config={'response_mime_type': 'application/json', 'response_schema': ContentAnalysis},
    )

    analysis_result: ContentAnalysis = response.parsed

    return {
        "type": "image",
        "original_content": "Uploaded image",
        "violations": analysis_result.violations,
        "severity_label": analysis_result.severity_label,
        "severity_percentage": analysis_result.severity_percentage,
        "sensitivity_label": analysis_result.sensitivity_label,
        "sensitivity_percentage": analysis_result.sensitivity_percentage,
        "explanation": analysis_result.explanation,
        "recommended_action": analysis_result.recommended_action,
    }

@app.post('/text')
def moderate_text(req: Req):
    if not req.query:
        return {"error": "Text input is required"}
    return analyze_text(req.query)

@app.post('/image')
async def moderate_image(image: UploadFile = File(...)):
    if image is None:
        return {"error": "No image file uploaded"}
    
    try:
        return  analyze_image(image)
    except Exception as e:
        return {"error1": str(e)}
if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)