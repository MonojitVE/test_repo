from services.llm import call_llm
from prompts.master_prompt import master_prompt
from prompts.sectional_prompt import (
    d_purposeofdocument_prompts,
    key_deliverables_prompt,
    d_objective,
    d_features_prompts,
    d_technical_approach_prompts,
    d_technology_stack_prompts,
    future_scope_prompt,
    time_budget_prompt,
)

# ------------ PURPOSE -------------
def generate_purpose(previous_output):
    prompt = f"""
You are an expert proposal writter.

STRICT RULES:
- Generate ONLY "2 PURPOSE OF THE DOCUMENT"
- Do NOT generate any other sections
- Do NOT repeat company overview
- Do NOT restart numbering

Previous Content:
{previous_output}


use the following reference:
{d_purposeofdocument_prompts}
"""
    return call_llm(prompt)

# ------------- OBJECTIVES -------------
def generate_objective(previous_output):
    prompt = f"""
You are an expert proposal writer.

STRICT RULES:
- Generate ONLY "4 OBJECTIVES"
- Do NOT repeat any other section

Previous Content:
{previous_output}

Use the following for reference:
{d_objective}
"""
    
    return call_llm(prompt)

# ------------- DELIVERABLES --------------
def generate_key_deliverables(previous_output):
    prompt = f"""
You are an expert proposal writer.

STRICT RULES:
- Generate ONLY "3 KEY DELIVERABLES"
- Output ONLY bullet points
- Do NOT generate other sections

previous content:
{previous_output}

Use the following for reference:
{key_deliverables_prompt}
"""
    return call_llm(prompt)

# -------------- FEATURES ----------------
def generate_features(previous_output: str) -> str:
    prompt = f"""
You are an expert proposal writer.

STRICT RULES:
- Generate ONLY "5 FEATURES AND FUNCTIONALITY"
- Do NOT repeat previous sections
- Keep structured formatting

Previous Content:
{previous_output}

Use the following structured guidance:
{d_features_prompts}
"""
    return call_llm(prompt)

# -------------- TECHNICAL APPROACH ---------------
def generate_technical_approach(previous_output: str) -> str:
    prompt = f"""
You are an expert proposal writer.

STRICT RULES:
- Generate ONLY "6 TECHNICAL APPROACH"
- DO NOT generate:
  1 COMPANY OVERVIEW
  2 PURPOSE
  3 KEY DELIVERABLES
  4 OBJECTIVES
  5 FEATURES
  7 TECHNOLOGY STACK
  8 FUTURE SCOPE
  9 TIME & BUDGET

- Do NOT repeat anything
- Do NOT restart numbering

Previous Content:
{previous_output}

Use the following structured guidance:
{d_technical_approach_prompts}
"""
    return call_llm(prompt)

# -------------- TECH STACK ---------------
def generate_technology_stack(previous_output: str) -> str:
    prompt = f"""
You are an expert proposal writer.

STRICT RULES:
- Generate ONLY "7 TECHNOLOGY STACK"
- Do NOT repeat any section

Previous Content:
{previous_output}

Use the following structured guidance:
{d_technology_stack_prompts}
"""
    return call_llm(prompt)


# ------------ FUTURE SCOPE --------------
def generate_future_scope(previous_output: str) -> str:
    prompt = f"""
You are an expert proposal writer.

STRICT RULES:
- Generate ONLY "8 FUTURE SCOPE"
- Output ONLY bullet points
- Do NOT repeat other sections

Previous Content:
{previous_output}


Use the following structured guidance:
{future_scope_prompt}
"""
    return call_llm(prompt)


# def generate_time_budget(previous_output: str) -> str:
#     prompt = f"""
# {master_prompt}

# Previous Content:
# {previous_output}

# Generate ONLY section:
# 9 TIME AND BUDGET ESTIMATE

# Use the following structured guidance:
# {time_budget_prompt}
# """
#     return call_llm(prompt)


# ---------------- TIME & BUDGET (CORRECT) ---------------- 
def generate_time_budget(
    user_phases: str = "",
    user_timeline: str = "",
    user_budget: str = "",
    user_resources: str = ""
) -> str:
    phases = user_phases or "1"
    timeline = user_timeline or "To be confirmed"
    budget = user_budget or "To be confirmed"
    resources = user_resources or "To be confirmed"

    return f"""9 TIME AND BUDGET ESTIMATE

The entire requirement will be completed in {phases} phase(s) and the Ballpark estimate will be {timeline} (Full Time). And the user-budget is {budget}.

TOTAL PROJECT TIME: Ballpark estimation will be {timeline} using technologies mentioned, which may vary depending upon the actual complexity and requirements. This duration is based on functionality mentioned in the document.

NO. OF RESOURCES REQUIRED: {resources}"""