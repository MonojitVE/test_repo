# from services.static_content import contents, company_overview
# from services.section_generators import (
#     generate_purpose,
#     generate_key_deliverables,
#     generate_objective,
#     generate_features,
#     generate_technical_approach,
#     generate_technology_stack,
#     generate_future_scope,
#     generate_time_budget,
# )


# def generate_proposal(user_input: str) -> str:
#     """
#     Main pipeline: generates a full proposal section by section.

#     Parameters
#     ----------
#     user_input : str
#         Short or detailed project description from the user.

#     Returns
#     -------
#     str
#         Complete formatted proposal as plain text.
#     """

#     # ── Section 2: Purpose of Document ──────────────────────────────────────
#     print("Generating: Purpose of Document...")
#     previous = f"{contents}\n{company_overview}"
#     purpose_output = generate_purpose(previous)

#     # ── Section 3: Key Deliverables ──────────────────────────────────────────
#     print("Generating: Key Deliverables...")
#     previous = f"{contents}\n{company_overview}\n{purpose_output}"
#     deliverables_output = generate_key_deliverables(previous)

#     # ── Section 4: Objectives ────────────────────────────────────────────────
#     print("Generating: Objectives...")
#     previous = f"""
# {contents}

# {company_overview}

# {purpose_output}

# 3 KEY DELIVERABLES
# {deliverables_output}
# """
#     objective_output = generate_objective(previous)

#     # ── Section 5: Features and Functionality ────────────────────────────────
#     print("Generating: Features and Functionality...")
#     previous = f"""
# {contents}

# {company_overview}

# {purpose_output}

# 3 KEY DELIVERABLES
# {deliverables_output}

# 4 OBJECTIVES
# {objective_output}
# """
#     features_output = generate_features(previous)

#     # ── Section 6: Technical Approach ────────────────────────────────────────
#     print("Generating: Technical Approach...")
#     previous = f"""
# {contents}

# {company_overview}

# {purpose_output}

# 3 KEY DELIVERABLES
# {deliverables_output}

# 4 OBJECTIVES
# {objective_output}

# 5 FEATURES AND FUNCTIONALITY
# {features_output}
# """
#     technical_output = generate_technical_approach(previous)

#     # ── Section 7: Technology Stack ──────────────────────────────────────────
#     print("Generating: Technology Stack...")
#     previous = f"""
# {contents}

# {company_overview}

# {purpose_output}

# 3 KEY DELIVERABLES
# {deliverables_output}

# 4 OBJECTIVES
# {objective_output}

# 5 FEATURES AND FUNCTIONALITY
# {features_output}

# 6 TECHNICAL APPROACH
# {technical_output}
# """
#     tech_stack_output = generate_technology_stack(previous)

#     # ── Section 8: Future Scope ──────────────────────────────────────────────
#     print("Generating: Future Scope...")
#     previous = f"""
# {contents}

# {company_overview}

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
# """
#     future_scope_output = generate_future_scope(previous)

#     # ── Section 9: Time and Budget Estimate ──────────────────────────────────
#     print("Generating: Time and Budget Estimate...")
#     previous = f"""
# {contents}

# {company_overview}

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
# """
#     time_budget_output = generate_time_budget(previous)

#     # ── Assemble Final Proposal ──────────────────────────────────────────────
#     final_text = f"""
# {contents}

# {company_overview}

# {purpose_output}

# 3 KEY DELIVERABLES
# {deliverables_output}

# {objective_output}

# {features_output}

# {technical_output}

# 7 TECHNOLOGY STACK
# {tech_stack_output}

# 8 FUTURE SCOPE
# {future_scope_output}

# {time_budget_output}
# """

#     print("\nProposal generation complete!")
#     return final_text


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

    base = f"""
{contents}

{company_overview}

USER REQUIREMENTS:
{user_input}
"""

    # ── Section 2 ─────────────────────────────────────────────
    print("Generating: Purpose...")
    purpose_output = generate_purpose(base)

    # ── Section 3 ─────────────────────────────────────────────
    print("Generating: Deliverables...")
    previous = f"{base}\n{purpose_output}"
    deliverables_output = generate_key_deliverables(previous)

    # ── Section 4 ─────────────────────────────────────────────
    print("Generating: Objectives...")
    previous = f"""
{base}

{purpose_output}

3 KEY DELIVERABLES
{deliverables_output}
"""
    objective_output = generate_objective(previous)

    # ── Section 5 ─────────────────────────────────────────────
    print("Generating: Features...")
    previous = f"""
{base}

{purpose_output}

3 KEY DELIVERABLES
{deliverables_output}

4 OBJECTIVES
{objective_output}
"""
    features_output = generate_features(previous)

    # ── Section 6 ─────────────────────────────────────────────
    print("Generating: Technical Approach...")
    previous = f"""
{base}

{purpose_output}

3 KEY DELIVERABLES
{deliverables_output}

4 OBJECTIVES
{objective_output}

5 FEATURES AND FUNCTIONALITY
{features_output}
"""
    technical_output = generate_technical_approach(previous)

    # ── Section 7 ─────────────────────────────────────────────
    print("Generating: Tech Stack...")
    previous = f"""
{base}

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

    # ── Section 8 ─────────────────────────────────────────────
    print("Generating: Future Scope...")
    previous = f"""
{base}

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

    # ── Section 9 (USER CONTROLLED) ───────────────────────────
    print("Generating: Time & Budget...")
#     previous = f"""
#     {base}

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
# """
    time_budget_output = generate_time_budget(
        user_phases=user_phases,
        user_timeline=user_timeline,
        user_budget = user_budget,
        user_resources = user_resources
    )

    # ── Final Assembly ────────────────────────────────────────
    final_text = f"""
{contents}

{company_overview}

{purpose_output}

3 KEY DELIVERABLES
{deliverables_output}

{objective_output}

{features_output}

{technical_output}

7 TECHNOLOGY STACK
{tech_stack_output}

8 FUTURE SCOPE
{future_scope_output}

{time_budget_output}
"""

    print("\n Proposal generation complete!")
    return final_text.strip()