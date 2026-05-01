"""
Proposal pipeline orchestrator.
Runs the same sequence as the notebook cells, top to bottom.
"""
import json
from app.services.parser_service import parse_user_prompt
from app.services.section_service import generate_section_json
from app.services.deliverables_service import generate_deliverables
from app.prompts.sections import SECTION_PIPELINE
from app.core.config import COMPANY_OVERVIEW


def run_full_pipeline(user_raw_prompt: str) -> dict:
    """
    Runs the complete proposal generation pipeline.
    Returns a dict with all sections and the rendered HTML.
    """
    # Step 0 — parse prompt
    parsed_project = parse_user_prompt(user_raw_prompt)
    project_details = json.dumps(parsed_project, indent=2)

    # Steps 1-6 — generate each section sequentially with accumulated context
    sections_json: dict[str, dict] = {}
    sections_text: dict[str, str] = {}
    accumulated_context = ""

    for section_name, section_key, section_dict in SECTION_PIPELINE:
        result = generate_section_json(
            section_name=section_name,
            section_dict=section_dict,
            project_details=project_details,
            prior_context=accumulated_context,
        )
        sections_json[section_key] = result
        sections_text[section_key] = json.dumps(result, indent=2)
        accumulated_context += f"\n=== {section_name} ===\n{sections_text[section_key]}\n"

    # Step 7 — key deliverables (synthesised from all prior)
    deliverables = generate_deliverables(accumulated_context)
    sections_json["deliverables"] = deliverables
    sections_text["deliverables"] = json.dumps(deliverables, indent=2)

    # Assemble full proposal JSON
    full_proposal_json = {
        "meta": {
            "generated_by": "ProposalGenerator v4",
            "project_name": parsed_project.get("project_name", "Project"),
            "project_type": parsed_project.get("project_type", ""),
            "domain":       parsed_project.get("domain", ""),
        },
        "company_overview":              COMPANY_OVERVIEW,
        "parsed_project_brief":          parsed_project,
        "purpose_of_document":           sections_json.get("purpose",      {}),
        "objectives":                    sections_json.get("objectives",   {}),
        "features_and_functionality":    sections_json.get("features",     {}),
        "technical_approach":            sections_json.get("technical",    {}),
        "technology_stack":              sections_json.get("techstack",    {}),
        "time_and_budget_estimate":      sections_json.get("budget",       {}),
        "key_deliverables":              sections_json.get("deliverables", {}),
    }

    return {
        "full_proposal": full_proposal_json,
    }
