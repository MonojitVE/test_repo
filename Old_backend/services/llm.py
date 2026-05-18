from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv(override=True)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def call_llm(prompt):
    response = client.chat.completions.create(
        model = "gpt-4o-mini",
        messages = [
            {"role":"system", "content":"You generate structured technical proposals in strict JSON format only."},
            {"role":"user", "content": prompt}
        ], 
        temperature = 0.3
    )

    return response.choices[0].message.content