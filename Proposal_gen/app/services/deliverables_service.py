import json
from app.core.llm import call_llm, clean_json
from app.prompts.sections import DELIVERABLES_SYSTEM, build_deliverables_user_msg


def generate_deliverables(accumulated_context: str) -> dict:
    """
    Synthesises the Key Deliverables section from all prior section outputs.
    Mirrors the notebook's Section 7 cell — no dict needed.
    """
    user_msg = build_deliverables_user_msg(accumulated_context)
    raw = call_llm(DELIVERABLES_SYSTEM, user_msg)

    try:
        result = json.loads(clean_json(raw))
    except json.JSONDecodeError:
        result = {
            "raw_output": raw,
            "_parse_error": "Parse failed — raw preserved"
        }

    return result
