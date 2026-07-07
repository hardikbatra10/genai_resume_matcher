import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])


def ask_llm(user_text: str) -> str:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=user_text,
    )
    return response.text


if __name__ == "__main__":
    reply = ask_llm("In one sentence, explain what RAG means to a beginner.")
    print("Gemini says:\n")
    print(reply)