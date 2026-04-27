# --------- NEW PIPELINE ----------

from services.static_content import contents, company_overview
from services.section_generators import (
    generate_purpose,
    generate_key_deliverables,
    generate_objective,
    generate_features,
    generate_technical_approach,
    generate_technology_stack,
    generate_future_scope,
    generate_time_budget,
)


def generate_proposal(
    user_input: str,
    user_timeline: str = "",
    user_budget: str = "",
    user_phases: str = "",
    user_resources: str = "",
) -> str:
    """
    Clean pipeline with structured inputs support
    """

    # Fix: Removing contents + company_overview from llm context
    base = f"""
USER REQUIREMENTS:
{user_input}
"""

    # ── Section 2: Generating purpose ─────────────────────────────────────────────
    print("Generating: Purpose...")
    purpose_output = generate_purpose(base)

    # ── Section 3: Deliverables ─────────────────────────────────────────────
    print("Generating: Deliverables...")
    previous = f"""{base}
    
    2 PURPOSE OF THE DOCUMENT
    {purpose_output}
"""
    deliverables_output = generate_key_deliverables(previous)

    # ── Section 4: objectives ─────────────────────────────────────────────
    print("Generating: Objectives...")
    previous = f"""
{base}

2 PURPOSE OF THE DOCUMENT
{purpose_output}

3 KEY DELIVERABLES
{deliverables_output}
"""
    objective_output = generate_objective(previous)

    # ── Section 5: features ─────────────────────────────────────────────
    print("Generating: Features...")
    previous = f"""
{base}

2 PURPOSE OF THE DOCUMENT
{purpose_output}

3 KEY DELIVERABLES
{deliverables_output}

4 OBJECTIVES
{objective_output}
"""
    features_output = generate_features(previous)

    # ── Section 6: Technical approach ─────────────────────────────────────────────
    print("Generating: Technical Approach...")
    previous = f"""
{base}

2 PURPOSE OF THE DOCUMENT
{purpose_output}

3 KEY DELIVERABLES
{deliverables_output}

4 OBJECTIVES
{objective_output}

5 FEATURES AND FUNCTIONALITY
{features_output}
"""
    technical_output = generate_technical_approach(previous)

    # ── Section 7: generating techstack ─────────────────────────────────────────────
    print("Generating: Tech Stack...")
    previous = f"""
{base}

2 PURPOSE OF THE DOCUMENT
{purpose_output}

3 KEY DELIVERABLES
{deliverables_output}

4 OBJECTIVES
{objective_output}

5 FEATURES AND FUNCTIONALITY
{features_output}

6 TECHNICAL APPROACH
{technical_output}
"""
    tech_stack_output = generate_technology_stack(previous)

    # ── Section 8: future scope ─────────────────────────────────────────────
    print("Generating: Future Scope...")
    previous = f"""
{base}

2 PURPOSE OF THE DOCUMENT
{purpose_output}

3 KEY DELIVERABLES
{deliverables_output}

4 OBJECTIVES
{objective_output}

5 FEATURES AND FUNCTIONALITY
{features_output}

6 TECHNICAL APPROACH
{technical_output}

7 TECHNOLOGY STACK
{tech_stack_output}
"""
    future_scope_output = generate_future_scope(previous)

    # ── Section 9 (USER CONTROLLED): time and budget ───────────────────────────
    print("Generating: Time & Budget...")
#     previous = f"
#     {base}

# 2 PURPOSE OF THE DOCUMENT
# {purpose_output}

# 3 KEY DELIVERABLES
# {deliverables_output}

# 4 OBJECTIVES
# {objective_output}

# 5 FEATURES AND FUNCTIONALITY
# {features_output}

# 6 TECHNICAL APPROACH
# {technical_output}

# 7 TECHNOLOGY STACK
# {tech_stack_output}

# 8 FUTURE SCOPE
# {future_scope_output}
# "
    time_budget_output = generate_time_budget(
    user_phases=user_phases,
    user_timeline=user_timeline,
    user_budget=user_budget,
    user_resources=user_resources
)


    # ── Final Assembly ────────────────────────────────────────
    final_text = f"""
{contents}

{company_overview}

2 PURPOSE OF THE DOCUMENT
{purpose_output}

3 KEY DELIVERABLES
{deliverables_output}

4 OBJECTIVES
{objective_output}

5 FEATURES AND FUNCTIONALITY
{features_output}

6 TECHNICAL APPROACH
{technical_output}

7 TECHNOLOGY STACK
{tech_stack_output}

8 FUTURE SCOPE
{future_scope_output}


{time_budget_output}
"""

    print("\n Proposal generation complete!")
    return final_text.strip()