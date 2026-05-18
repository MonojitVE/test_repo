import re
from app.core.config import client


def clean_json(raw: str) -> str:
    """Strip markdown code fences before JSON parsing."""
    raw = raw.strip()
    raw = re.sub(r'^```[a-zA-Z]*\n?', '', raw)
    raw = re.sub(r'\n?```$', '', raw)
    return raw.strip()


def call_llm(system_msg: str, user_msg: str, temperature: float = 0.3) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user",   "content": user_msg}
        ],
        temperature=temperature,
        max_tokens=4096
    )
    return response.choices[0].message.content
