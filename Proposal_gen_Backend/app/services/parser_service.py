import json
from app.core.llm import call_llm, clean_json
from app.prompts.parser import PARSER_SYSTEM, build_parser_user_msg


def parse_user_prompt(user_raw_prompt: str) -> dict:
    """
    Converts free-text user prompt into a structured project_details dict.
    Mirrors the notebook's Step 0 — NLP Prompt Parser cell.
    """
    user_msg = build_parser_user_msg(user_raw_prompt)
    raw_parsed = call_llm(PARSER_SYSTEM, user_msg)

    try:
        parsed_project = json.loads(clean_json(raw_parsed))
    except json.JSONDecodeError:
        parsed_project = {
            "raw_output": raw_parsed,
            "parse_error": "Parser did not return valid JSON"
        }

    return parsed_project
