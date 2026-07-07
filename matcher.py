import os
import numpy as np
from dotenv import load_dotenv
from google import genai
from resume_extractor import extract_text_from_pdf

load_dotenv()
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

EMBEDDING_MODEL = "models/gemini-embedding-001"


def get_embedding(text: str) -> list[float]:
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
    )
    return result.embeddings[0].values

def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    a = np.array(vec_a)
    b = np.array(vec_b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


sample_jobs = [
    {
        "title": "Frontend Developer",
        "description": "Looking for a React developer with strong CSS and JavaScript skills to build responsive web interfaces."
    },
    {
        "title": "Backend Engineer",
        "description": "Seeking a backend engineer experienced in Python, REST APIs, and database design for a fintech platform."
    },
    {
        "title": "Data Analyst",
        "description": "We need a data analyst skilled in SQL, Excel, and dashboard tools like Tableau or Power BI."
    },
    {
        "title": "DevOps Engineer",
        "description": "Hiring a DevOps engineer with experience in AWS, Docker, Kubernetes, and CI/CD pipelines."
    },
]


def rank_jobs_against_resume(resume_text: str, jobs: list[dict]) -> list[dict]:
    resume_embedding = get_embedding(resume_text)

    ranked = []
    for job in jobs:
        job_embedding = get_embedding(job["description"])
        score = cosine_similarity(resume_embedding, job_embedding)
        ranked.append({
            "title": job["title"],
            "description": job["description"],
            "score": round(float(score), 4),
        })

    ranked.sort(key=lambda job: job["score"], reverse=True)
    return ranked


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python matcher.py path/to/resume.pdf")
        sys.exit(1)

    pdf_path = sys.argv[1]
    my_resume_text = extract_text_from_pdf(pdf_path)

    results = rank_jobs_against_resume(my_resume_text, sample_jobs)

    print("Ranked job matches:\n")
    for job in results:
        print(f"{job['score']}  —  {job['title']}")