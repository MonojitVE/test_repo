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


def generate_purpose(previous_output):
    prompt = f"""
{master_prompt}

Previous Content:
{previous_output}

Generate only this section:
2 Purpose of the document 

use the following reference:
{d_purposeofdocument_prompts}
"""
    return call_llm(prompt)

def generate_objective(previous_output):
    prompt = f"""
{master_prompt}

Previous Content:
{previous_output}

Generate only this section:
4 objectives

use the following for reference:
{d_objective}
"""
    
    return call_llm(prompt)

def generate_key_deliverables(previous_output):
    prompt = f"""
{master_prompt}

previous content:
{previous_output}

Generate only this section:
3 KEY DELIVERABLES

Use the following for reference:
{key_deliverables_prompt}
"""
    return call_llm(prompt)

def generate_features(previous_output: str) -> str:
    prompt = f"""
{master_prompt}

Previous Content:
{previous_output}

Generate ONLY section:
5 FEATURES AND FUNCTIONALITY

Use the following structured guidance:
{d_features_prompts}
"""
    return call_llm(prompt)


def generate_technical_approach(previous_output: str) -> str:
    prompt = f"""
{master_prompt}

Previous Content:
{previous_output}

Generate ONLY section:
6 TECHNICAL APPROACH
Use the following structured guidance:
{d_technical_approach_prompts}
"""
    return call_llm(prompt)


def generate_technology_stack(previous_output: str) -> str:
    prompt = f"""
{master_prompt}

Previous Content:
{previous_output}

Generate ONLY section:
7 TECHNOLOGY STACK

Use the following structured guidance:
{d_technology_stack_prompts}
"""
    return call_llm(prompt)


def generate_future_scope(previous_output: str) -> str:
    prompt = f"""
{master_prompt}

Previous Content:
{previous_output}

Generate ONLY section:
8 FUTURE SCOPE

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



def generate_time_budget(
    user_phases: str = "",
    user_timeline: str = "",
    user_resources: str = ""
) -> str:
    phases = user_phases or "1"
    timeline = user_timeline or "To be confirmed"
    resources = user_resources or "To be confirmed"

    return f"""9 TIME AND BUDGET ESTIMATE

The entire requirement will be completed in {phases} phase(s) and the Ballpark estimate will be {timeline} (Full Time).

TOTAL PROJECT TIME: Ballpark estimation will be {timeline} using technologies mentioned, which may vary depending upon the actual complexity and requirements. This duration is based on functionality mentioned in the document.

NO. OF RESOURCES REQUIRED: {resources}"""