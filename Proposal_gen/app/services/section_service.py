import json
from app.core.llm import call_llm, clean_json


SECTION_SYSTEM = (
    "You are a senior technical writer and solutions architect. "
    "You produce detailed, engineer-ready technical proposal sections. "
    "Every field must be specific to the project — no generic filler. "
    "Respond ONLY with a valid JSON object. No markdown fences. No extra text."
)


def generate_section_json(
    section_name: str,
    section_dict: dict,
    project_details: str,
    prior_context: str = ""
) -> dict:
    """
    Calls LLM for one section, asks for STRICT JSON.
    Passes accumulated prior context + parsed project details.
    Mirrors the notebook's generate_section_json() function.
    """
    context_block = ""
    if prior_context:
        context_block = f"\n--- CONTEXT FROM PREVIOUS SECTIONS ---\n{prior_context}\n--- END CONTEXT ---\n"

    user_msg = f"""STRUCTURED PROJECT BRIEF:
{project_details}
{context_block}
GENERATE SECTION: {section_name}

Guidance for this section (use these as the JSON keys and instructions):
{json.dumps(section_dict, indent=2)}

Requirements:
- Be SPECIFIC and DEEP — an engineer reading this must understand exactly what to build
- Reference actual technologies from the project brief where relevant
- For list fields: minimum 4 items unless the domain genuinely has fewer
- For string fields: minimum 2 sentences — no one-liners
- Honour all must_have_requirements from the project brief
- Do NOT repeat content already in the CONTEXT sections above
- Return a JSON object where each key maps to a string, array, or nested object
"""

    raw = call_llm(SECTION_SYSTEM, user_msg)
    cleaned = clean_json(raw)

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError:
        result = {
            "raw_output": cleaned,
            "_parse_error": "LLM did not return valid JSON — raw preserved"
        }

    return result
