from fastapi import FastAPI, UploadFile, File, Form
import shutil
import os

from resume_extractor import extract_text_from_pdf, extract_resume_fields
from job_fetcher import fetch_jobs
from vector_store import build_job_index, query_index
from recommender import get_resume_suggestions
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploaded_resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    save_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume_text = extract_text_from_pdf(save_path)
    structured = extract_resume_fields(resume_text)

    return {
        "filename": file.filename,
        "structured_data": structured,
    }


@app.post("/get-matches")
async def get_matches(resume_filename: str = Form(...), search_query: str = Form(...)):
    resume_path = os.path.join(UPLOAD_DIR, resume_filename)
    resume_text = extract_text_from_pdf(resume_path)

    jobs = fetch_jobs(search_query)
    index = build_job_index(jobs)
    matches = query_index(index, jobs, resume_text, top_k=5)

    return {"matches": matches}


@app.post("/get-recommendations")
async def get_recommendations(
    resume_filename: str = Form(...),
    job_title: str = Form(...),
    job_description: str = Form(...),
):
    resume_path = os.path.join(UPLOAD_DIR, resume_filename)
    resume_text = extract_text_from_pdf(resume_path)

    suggestions = get_resume_suggestions(resume_text, job_title, job_description)

    return {"suggestions": suggestions}