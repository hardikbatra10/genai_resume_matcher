import os
import sys
import numpy as np
import faiss
from dotenv import load_dotenv
from google import genai
from resume_extractor import extract_text_from_pdf
from job_fetcher import fetch_jobs

load_dotenv()
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

EMBEDDING_MODEL = "gemini-embedding-001"
EMBEDDING_DIM = 3072


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


def query_index(index, jobs: list[dict], resume_text: str, top_k: int = 5) -> list[dict]:
    resume_vector = np.array([get_embedding(resume_text)]).astype("float32")
    faiss.normalize_L2(resume_vector)

    scores, indices = index.search(resume_vector, top_k)

    results = []
    for score, idx in zip(scores[0], indices[0]):
        job = jobs[idx]
        results.append({
            "title": job["title"],
            "company": job["company"],
            "location": job["location"],
            "description": job["description"],
            "url": job["url"],
            "score": round(float(score), 4),
        })
    return results


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python vector_store.py path/to/resume.pdf \"job search query\"")
        sys.exit(1)

    pdf_path = sys.argv[1]
    search_query = sys.argv[2]

    print(f"Fetching live jobs for '{search_query}'...")
    jobs = fetch_jobs(search_query)

    print(f"Reading resume from {pdf_path}...")
    resume_text = extract_text_from_pdf(pdf_path)

    print("Embedding jobs and building index...")
    index = build_job_index(jobs)

    print("Ranking jobs against resume...\n")
    results = query_index(index, jobs, resume_text)

    print("Top matches:\n")
    for r in results:
        print(f"{r['score']}  —  {r['title']} @ {r['company']} ({r['location']})")
        print(f"   {r['url']}\n")