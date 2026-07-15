import os
import sys
import numpy as np
import faiss
from dotenv import load_dotenv
from google import genai
from resume_extractor import extract_text_from_pdf

load_dotenv()
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

EMBEDDING_MODEL = "gemini-embedding-001"
EMBEDDING_DIM = 3072

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


def get_embedding(text: str) -> list[float]:
    result = client.models.embed_content(model=EMBEDDING_MODEL, contents=text)
    return result.embeddings[0].values


def build_job_index(jobs: list[dict]):
    vectors = [get_embedding(job["description"]) for job in jobs]
    vectors_np = np.array(vectors).astype("float32")
    faiss.normalize_L2(vectors_np)

    index = faiss.IndexFlatIP(EMBEDDING_DIM)
    index.add(vectors_np)

    return index


def query_index(index, jobs: list[dict], resume_text: str, top_k: int = 4) -> list[dict]:
    resume_vector = np.array([get_embedding(resume_text)]).astype("float32")
    faiss.normalize_L2(resume_vector)

    scores, indices = index.search(resume_vector, top_k)

    results = []
    for score, idx in zip(scores[0], indices[0]):
        job = jobs[idx]
        results.append({
            "title": job["title"],
            "score": round(float(score), 4),
        })
    return results


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python vector_store.py path/to/resume.pdf")
        sys.exit(1)

    pdf_path = sys.argv[1]
    resume_text = extract_text_from_pdf(pdf_path)

    index = build_job_index(sample_jobs)
    results = query_index(index, sample_jobs, resume_text)

    print("Ranked job matches (via FAISS):\n")
    for r in results:
        print(f"{r['score']}  —  {r['title']}")