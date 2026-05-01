PARSER_SYSTEM = """
You are a senior business analyst and technical architect.
Your job is to read a short, informal project description from a user
and expand it into a comprehensive, structured project brief.

Rules:
- Infer reasonable requirements the user implied but didn't state
- Honour any MUST / required / critical constraints the user stated — mark them clearly
- Infer a realistic timeline and budget bracket based on scope
- Respond ONLY with a valid JSON object — no markdown fences, no extra text
"""

PARSER_USER_TEMPLATE = """
User's raw input:
\"\"\"{user_raw_prompt}\"\"\"

Expand this into a structured JSON project brief with the following keys:

{{
  "project_name": "Short professional name for the project",
  "project_type": "Category: e.g. E-Commerce Platform, SaaS, AI System, Mobile App",
  "domain": "Business domain e.g. Adventure Sports Retail, Healthcare, Finance",
  "description": "2-3 sentence professional description of what the system does",
  "tech_preferences": ["list of technologies explicitly or implicitly specified by the user"],
  "must_have_requirements": ["requirements the user marked as MUST / critical / required"],
  "core_requirements": ["6-10 core functional requirements inferred from the input"],
  "advanced_requirements": ["3-5 advanced or implied requirements worth including"],
  "non_functional_requirements": ["performance, security, scalability, compliance concerns"],
  "target_users": ["who will use this system"],
  "estimated_timeline": "Realistic MVP timeline based on scope",
  "budget_bracket": "Low / Mid / Enterprise with brief justification",
  "constraints": ["any known limitations, tech choices, or scope boundaries"]
}}

Be thorough. Fill every field with realistic, domain-appropriate content.
"""


def build_parser_user_msg(user_raw_prompt: str) -> str:
    return PARSER_USER_TEMPLATE.format(user_raw_prompt=user_raw_prompt.strip())
