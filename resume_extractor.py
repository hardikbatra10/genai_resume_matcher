import sys
import json
import os
from dotenv import load_dotenv
import pdfplumber
from google import genai

load_dotenv()
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

def extract_text_from_pdf(pdf_path: str) -> str:
    full_text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                full_text += page_text + "\n"
    return full_text

def extract_links_from_pdf(pdf_path: str) -> list[str]:
    links = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            for link in page.hyperlinks:
                if "uri" in link:
                    links.append(link["uri"])
    return links

def extract_resume_fields(resume_text: str) -> dict:
    prompt = f"""Extract structured information from the resume text below.

Return ONLY valid JSON, with no extra text before or after it, in exactly
this shape:

{{
  "name": "string",
  "skills": ["string", "string"],
  "experience": [
    {{"title": "string", "company": "string", "duration": "string"}}
  ],
  "education": [
    {{"degree": "string", "institution": "string", "year": "string"}}
  ]
  "projects": [
    {{"title": "string", "description": "string", "link": "string"}}
  ],
}}

If a field is not present in the resume, use an empty string or empty list.

Resume text:
---
{resume_text}
---
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    raw_reply = response.text

    cleaned = raw_reply.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        cleaned = cleaned.replace("json\n", "", 1)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        print("Could not parse JSON. Raw reply was:\n", raw_reply)
        raise e


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python resume_extractor.py path/to/resume.pdf")
        sys.exit(1)

    pdf_path = sys.argv[1]

    print(f"Reading {pdf_path} ...")
    text = extract_text_from_pdf(pdf_path)
    links = extract_links_from_pdf(pdf_path)

    if links:
        text += "\n\nLinks found in this document are:\n" + "\n".join(links)

    if not text.strip():
        print("No text found in this PDF. It may be a scanned image without a text layer.")
        sys.exit(1)

    print("Sending resume text to Gemini for extraction...")
    result = extract_resume_fields(text)

    print("\nStructured result:\n")
    print(json.dumps(result, indent=2))