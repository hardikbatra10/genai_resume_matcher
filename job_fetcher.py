import os
import requests
from dotenv import load_dotenv

load_dotenv()

APP_ID = os.environ["ADZUNA_APP_ID"]
APP_KEY = os.environ["ADZUNA_APP_KEY"]


def fetch_jobs(query: str, country: str = "in", results_per_page: int = 20) -> list[dict]:
    url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/1"

    params = {
        "app_id": APP_ID,
        "app_key": APP_KEY,
        "what": query,
        "results_per_page": results_per_page,
    }

    response = requests.get(url, params=params)
    response.raise_for_status()

    data = response.json()

    jobs = []
    for item in data["results"]:
        jobs.append({
            "title": item.get("title", ""),
            "description": item.get("description", ""),
            "company": item.get("company", {}).get("display_name", ""),
            "location": item.get("location", {}).get("display_name", ""),
            "url": item.get("redirect_url", ""),
        })

    return jobs


if __name__ == "__main__":
    jobs = fetch_jobs("python developer")

    print(f"Fetched {len(jobs)} jobs:\n")
    for job in jobs:
        print(f"{job['title']} — {job['company']} ({job['location']})")