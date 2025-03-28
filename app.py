# from langchain_google_genai import GoogleGenerativeAIEmbeddings
# from langchain_community.vectorstores import Chroma
# from langchain_huggingface import HuggingFacePipeline
# from transformers import pipeline
# from fastapi import FastAPI, UploadFile, File
# import uvicorn
# import os
# from dotenv import load_dotenv
# from pydantic import BaseModel
# from typing import List, Optional
# import PIL.Image
# from google import genai

# load_dotenv()

# class Req(BaseModel):
#     query: Optional[str] = None

# class Violation(BaseModel):
#     guideline_name: str
#     violation_reason: str

# class ContentAnalysis(BaseModel):
#     violations: List[Violation]
#     overall_severity_percentage: float

# app = FastAPI()
# GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
# os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
# db = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)

# generator = pipeline("text-generation", model="23aryangupta/Llama-3.2-3B-Instruct-hate_speech")
# llm = HuggingFacePipeline(pipeline=generator)

# severity_map = {
#     "none": 1,
#     "low": 25,
#     "medium": 50,
#     "high": 80,
#     "critical": 99
# }

# def analyze_text(query):
#     retrieved_docs = db.similarity_search(query, k=2)
#     context = "\n".join([doc.page_content for doc in retrieved_docs])

#     response = generator(
#         f"Analyze the following content for policy violations based on these YouTube Guidelines:\n"
#         f"{context}\n\n"
#         f"Return details in this format:\n"
#         f"Violation Type: <type or 'None'>\n"
#         f"Specific Guideline Violated: <guideline or 'None'>\n"
#         f"Severity Level: <none/low/medium/high/critical>\n"
#         f"Explanation: <detailed explanation or 'No violation detected'>\n"
#         f"Recommended Action: <action or 'No action required'>\n"
#         f"Content: {query}",
#         max_length=1000,
#         do_sample=True,
#         temperature=0.7
#     )

#     generated_text = response[0]["generated_text"]
#     def extract_moderation_details(text):
#         violation_type = "None"
#         guideline_violated = "None"
#         severity = "none"
#         explanation = "No violation detected."
#         recommended_action = "No action required."

#         lines = text.split("\n")
#         for line in lines:
#             if "Violation Type:" in line:
#                 violation_type = line.split(":", 1)[1].strip()
#             elif "Specific Guideline Violated:" in line:
#                 guideline_violated = line.split(":", 1)[1].strip()
#             elif "Severity Level:" in line:
#                 severity = line.split(":", 1)[1].strip().lower()
#             elif "Explanation:" in line:
#                 explanation = line.split(":", 1)[1].strip()
#             elif "Recommended Action:" in line:
#                 recommended_action = line.split(":", 1)[1].strip()

#         severity_percentage = severity_map.get(severity, "Unknown")

#         return {
#             "original_content": query,
#             "violation_type": violation_type,
#             "guideline_violated": guideline_violated,
#             "severity_label": severity.capitalize(),
#             "severity_percentage": f"{severity_percentage}%",
#             "explanation": explanation,
#             "recommended_action": recommended_action,
#             "retrieved_context": context
#         }

#     return extract_moderation_details(generated_text)

# def analyze_image(image: UploadFile):
#     img = PIL.Image.open(image.file)
#     client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

#     response = client.models.generate_content(
#         model="gemini-2.0-flash",
#         contents=[
#             "Check if this image violates social media content guidelines. Look for hate speech, nudity, violence, or misleading information. "
#             "For each violation found, provide the specific guideline name and reason for violation. Also provide an overall severity percentage (0-100) "
#             "for all violations combined.",
#             img
#         ],
#         config={
#             'response_mime_type': 'application/json',
#             'response_schema': ContentAnalysis,
#         },
#     )

#     analysis_result: ContentAnalysis = response.parsed

#     return {
#         "violations": [{"guideline": v.guideline_name, "reason": v.violation_reason} for v in analysis_result.violations],
#         "overall_severity_percentage": f"{analysis_result.overall_severity_percentage}%"
#     }

# @app.post('/text')
# def moderate_text(req: Req):
#     if not req.query:
#         return {"error": "Text input is required"}
#     return analyze_text(req.query)

# @app.post('/image')
# def moderate_image(image: UploadFile = File(...)):
#     return analyze_image(image)
# if __name__ == "__main__":
#     uvicorn.run(app, host="localhost", port=8000)

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

class Violation(BaseModel):
    guideline_name: str
    violation_reason: str

class ContentAnalysis(BaseModel):
    violations: List[Violation]
    overall_severity_percentage: float

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
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
            "violation_type": violation_type,
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
    img = PIL.Image.open(image.file)
    client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            "Analyze this image for social media violations. Detect hate speech, nudity, violence, misleading info."
            "Provide violations found, the guideline name, severity level (none/low/medium/high/critical), and sensitivity level (none/low/medium/high/critical)."
            "Also provide an explanation and recommended action."
            "Return details in this format:\n"
            "Violation Type: <type or 'None'>\n"
            "Specific Guideline Violated: <guideline or 'None'>\n"
            "Severity Level: <none/low/medium/high/critical>\n"
            "Sensitivity Level: <none/low/medium/high/critical>\n"
            "Explanation: <detailed explanation or 'No violation detected'>\n"
            "Recommended Action: <action or 'No action required'>",
            img
        ],
        config={'response_mime_type': 'application/json', 'response_schema': ContentAnalysis},
    )

    analysis_result: ContentAnalysis = response.parsed

    # Extract first violation (if any)
    if analysis_result.violations:
        violation = analysis_result.violations[0]
        violation_type = violation.guideline_name
        explanation = violation.violation_reason
    else:
        violation_type = "None"
        explanation = "No violation detected."

    # Convert severity & sensitivity to percentages
    severity = analysis_result.overall_severity_percentage
    sensitivity = 100 if severity > 80 else 85 if severity > 50 else 60 if severity > 25 else 30 if severity > 1 else 10

    return {
        "type": "image",
        "original_content": "Uploaded image",
        "violation_type": violation_type,
        "guideline_violated": violation_type if violation_type != "None" else "None",
        "severity_label": "Critical" if severity > 80 else "High" if severity > 50 else "Medium" if severity > 25 else "Low" if severity > 1 else "None",
        "severity_percentage": f"{severity}%",
        "sensitivity_label": "Critical" if sensitivity > 80 else "High" if sensitivity > 50 else "Medium" if sensitivity > 25 else "Low" if sensitivity > 1 else "None",
        "sensitivity_percentage": f"{sensitivity}%",
        "explanation": explanation,
        "recommended_action": "Review and take necessary action" if severity > 50 else "Monitor and warn" if severity > 25 else "No action required."
    }

@app.post('/text')
def moderate_text(req: Req):
    if not req.query:
        return {"error": "Text input is required"}
    return analyze_text(req.query)

# @app.post('/image')
# def moderate_image(image: UploadFile = File(...)):
#     return analyze_image(image)
# if __name__ == "__main__":
#     uvicorn.run(app, host="localhost", port=8000)

@app.post('/image')
async def moderate_image(image: UploadFile = File(...)):  # Accept an image file
    if image is None:
        return {"error": "No image file uploaded"}
    
    try:
        # Analyze the image and return the result
        return  analyze_image(image)  # Assuming analyze_image is an async function
    except Exception as e:
        return {"error1": str(e)}
if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)