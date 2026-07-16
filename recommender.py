import os
import sys
from dotenv import load_dotenv
from google import genai
from resume_extractor import extract_text_from_pdf
from job_fetcher import fetch_jobs
from vector_store import build_job_index, query_index, get_embedding

load_dotenv()
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])


def get_resume_suggestions(resume_text: str, job_title: str, job_description: str) -> str:
    prompt = f"""You are a career advisor. Given this resume and this job description,
list specific changes to make to the resume to better match this job.
Be concrete — mention exact phrases or skills to add or rephrase.
Keep it to 3-5 bullet points.

Resume:
---
{resume_text}
---

Job Title: {job_title}
Job Description:
---
{job_description}
---
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    return response.text


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python recommender.py path/to/resume.pdf \"job search query\"")
        sys.exit(1)

    pdf_path = sys.argv[1]
    search_query = sys.argv[2]

    print(f"Fetching live jobs for '{search_query}'...")
    jobs = fetch_jobs(search_query)

    print(f"Reading resume from {pdf_path}...")
    resume_text = extract_text_from_pdf(pdf_path)

    print("Ranking jobs against resume...")
    index = build_job_index(jobs)
    top_matches = query_index(index, jobs, resume_text, top_k=3)

    for match in top_matches:
        full_job = next(j for j in jobs if j["title"] == match["title"])

        print(f"\n{'=' * 60}")
        print(f"{match['score']}  —  {match['title']} @ {match['company']}")
        print(f"{'=' * 60}")

        suggestions = get_resume_suggestions(
            resume_text,
            full_job["title"],
            full_job["description"],
        )
        print(suggestions)