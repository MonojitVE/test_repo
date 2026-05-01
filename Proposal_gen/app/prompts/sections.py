# ── SECTION 1: Purpose of the Document ──────────────────────────────────────
d_purpose = {
    "project_name": "State the official project name clearly.",
    "project_type": "Classify the system type precisely (e.g., B2C E-Commerce Platform, Multi-Tenant SaaS, AI-Powered Mobile App).",
    "problem_statement": "Write 2-3 sentences describing the core business problem or market gap this system addresses. Be specific to the domain.",
    "solution_summary": "Describe the proposed solution in 3-4 sentences — what it does, who benefits, and how it addresses the problem.",
    "scope_and_boundaries": "Clearly define what is IN scope and what is explicitly OUT of scope for this engagement. This prevents scope creep.",
    "key_assumptions": "List 3-5 assumptions being made (e.g., client provides content, third-party APIs are accessible, infra is cloud-based).",
    "document_purpose": "Explain that this document serves as the binding reference for all engineering, design, and delivery decisions.",
    "stakeholder_alignment": "Name stakeholder groups (client, dev team, QA, ops) and explain how this document aligns their expectations.",
    "future_scope": "Describe 3-4 realistic phase-2 enhancements that are excluded from this engagement but planned for the future.",
    "closing_statement": "A confident closing paragraph explaining the system's long-term value, extensibility, and return on investment."
}

# ── SECTION 2: Objectives ────────────────────────────────────────────────────
d_objectives = {
    "primary_objective": "One-sentence north star: the single most important outcome this system must achieve.",
    "functional_objectives": [
        "List 6-8 specific, measurable functional goals. Each should reference a concrete system behaviour.",
        "Example format: 'Enable registered users to complete checkout in under 3 steps with Stripe/Razorpay integration.'"
    ],
    "technical_objectives": [
        "List 5-6 technical goals covering architecture, performance, security, and maintainability.",
        "Examples: 99.9% uptime SLA, sub-200ms API response, OWASP Top 10 compliance, modular monorepo structure."
    ],
    "business_objectives": [
        "List 3-4 business outcomes the client expects from this system.",
        "Examples: reduce manual order processing, increase conversion rate, enable multi-vendor expansion."
    ],
    "non_functional_objectives": [
        "Cover scalability, accessibility (WCAG 2.1), internationalisation, SEO, mobile responsiveness."
    ],
    "success_criteria": "Define 4-5 measurable criteria that determine whether the project has been successfully delivered."
}

# ── SECTION 3: Features and Functionality ────────────────────────────────────
d_features = {
    "section_intro": "Write a concise paragraph introducing the feature set — reference the domain and user types.",
    "module_list": "Identify ALL major modules. Each module gets its own entry with: module name, description, and sub-features.",
    "module_detail_instruction": (
        "For each module provide: "
        "(1) a 1-2 sentence description of what it does, "
        "(2) 4-8 sub-features as specific user stories or system behaviours, "
        "(3) any must-have flags inherited from user constraints."
    ),
    "user_journey_flows": "Describe 2-3 primary end-to-end user journeys (e.g., guest browse → register → add to cart → checkout → confirmation).",
    "admin_panel": "Describe the admin/back-office panel in detail: user management, order management, inventory, analytics, config.",
    "api_contracts": "List the major API endpoint groups that will be needed (e.g., /auth, /products, /orders, /payments, /users).",
    "edge_cases_and_constraints": "List 4-6 important edge cases or constraint scenarios engineers must handle (e.g., payment failure retry, out-of-stock at checkout).",
    "must_haves": "Explicitly call out the MUST-HAVE features from the user's requirements with clear descriptions."
}

# ── SECTION 4: Technical Approach ────────────────────────────────────────────
d_technical = {
    "architecture_overview": "Describe the high-level architecture pattern chosen (e.g., layered monolith, microservices, BFF + SPA). Justify the choice for this project scale.",
    "system_components": "List every major system component with its responsibility: Frontend, Backend API, Database, Cache, Queue, Storage, CDN, Auth Service, Payment Service.",
    "frontend_architecture": (
        "Detail the frontend approach: "
        "framework choice and rationale, state management strategy, routing, component library, "
        "SSR vs CSR vs SSG decision, code splitting, lazy loading, and accessibility approach."
    ),
    "backend_architecture": (
        "Detail the backend: framework choice, project structure (controllers/services/repos pattern), "
        "REST vs GraphQL decision, middleware stack, error handling strategy, request validation, and logging."
    ),
    "database_design": (
        "Explain the database strategy: primary DB choice with rationale, "
        "key entities and relationships, indexing strategy, migration approach, and read/write patterns."
    ),
    "authentication_and_authorisation": (
        "Describe the full auth flow: registration, login, JWT/session management, "
        "refresh token strategy, RBAC roles and permissions, OAuth/SSO if applicable."
    ),
    "payment_integration": (
        "If payments are required: describe the payment gateway integration in detail — "
        "webhook handling, idempotency keys, refund flows, failed payment retry logic, PCI-DSS considerations."
    ),
    "third_party_integrations": "List each third-party service, the integration method (REST/SDK/Webhook), and how failures are handled gracefully.",
    "caching_strategy": "Describe what gets cached (API responses, sessions, product data), the cache invalidation strategy, and the tool used.",
    "security_hardening": (
        "Cover: input validation, SQL injection prevention, XSS/CSRF protection, "
        "rate limiting, CORS policy, secrets management, HTTPS enforcement, dependency scanning."
    ),
    "scalability_plan": "Explain how the system handles growth: horizontal scaling, stateless services, DB connection pooling, CDN for static assets, load balancing.",
    "error_handling_and_observability": "Describe structured error handling, logging strategy (what gets logged), monitoring setup, alerting thresholds, and incident response.",
    "testing_strategy": (
        "Define the full testing pyramid: "
        "unit tests (coverage target), integration tests (critical paths), E2E tests (key user journeys), "
        "performance tests (load targets), security tests (OWASP scan)."
    ),
    "deployment_pipeline": (
        "Describe CI/CD pipeline stages: lint → test → build → staging deploy → smoke test → prod deploy. "
        "Tools used, environment strategy (dev/staging/prod), rollback mechanism."
    ),
    "post_launch": "Describe the hypercare period, bug triage SLA, patch release cadence, and handover documentation plan."
}

# ── SECTION 5: Technology Stack ──────────────────────────────────────────────
d_techstack = {
    "instruction": (
        "Generate a structured technology stack. For EACH technology listed, provide: "
        "(1) the tool/library name, (2) the specific version or version range, "
        "(3) a one-sentence rationale for choosing it for THIS project."
    ),
    "frontend": "Framework, UI library, state management, routing, forms, testing library, build tool.",
    "backend": "Language, framework, ORM/query builder, validation library, job queue, API documentation tool.",
    "database": "Primary DB, secondary DB if needed, migration tool, backup strategy.",
    "caching_and_sessions": "Cache layer and session store with justification.",
    "authentication": "Auth library, JWT library, OAuth provider if needed.",
    "payment": "Payment gateway SDK(s) — must match user's must-have requirements.",
    "storage": "File/media storage service and CDN for asset delivery.",
    "devops_and_infrastructure": "Cloud provider, containerisation, orchestration, CI/CD tool, IaC tool.",
    "monitoring_and_logging": "APM tool, log aggregator, error tracker, uptime monitor.",
    "security_tooling": "Dependency scanner, secrets manager, SAST tool if applicable.",
    "developer_tooling": "Linter, formatter, pre-commit hooks, API client for testing."
}

# ── SECTION 6: Time and Budget ────────────────────────────────────────────────
d_budget = {
    "instruction": (
        "Generate a detailed Time and Budget Estimate. "
        "Be realistic based on the scope described in previous sections. "
        "Use the project's tech preferences and must-have requirements to calibrate."
    ),
    "phases": (
        "Break the project into 4-6 phases. For each phase provide: "
        "phase name, description of work, duration in weeks, and team members involved."
    ),
    "team_composition": "List each role needed, count, and their phase involvement (e.g., 1x Tech Lead, 2x Backend Dev, 1x Frontend Dev, 1x QA).",
    "total_timeline": "Total calendar duration with explanation of any parallelism or dependencies between phases.",
    "budget_estimate": (
        "Provide a realistic budget range (low-end and high-end) with breakdown by: "
        "development effort, infrastructure/hosting (monthly), third-party API costs, QA, and contingency."
    ),
    "risk_factors": "List 3-4 factors that could extend timeline or increase budget, and how to mitigate them.",
    "payment_milestones": "Suggest a milestone-based payment schedule tied to deliverable phases."
}

# ── SECTION 7: Key Deliverables (no dict — synthesised from all prior) ────────
DELIVERABLES_SYSTEM = (
    "You are a senior delivery manager and technical lead. "
    "Respond ONLY with a valid JSON object. No markdown. No extra text."
)

DELIVERABLES_USER_TEMPLATE = """
You have a complete technical proposal in the CONTEXT below.
Synthesise a KEY DELIVERABLES section from it.

--- FULL PROPOSAL CONTEXT ---
{accumulated_context}
--- END CONTEXT ---

Return a JSON object with exactly these keys:

{{
  "executive_summary_of_deliverables": "2-3 sentence summary of what will be delivered at the end of this engagement.",

  "software_deliverables": [
    // List every concrete software artifact: apps, APIs, admin panels, mobile apps, docs
    // Format each as: {{ "item": "name", "description": "what it is and does", "acceptance_criteria": "how we know it's done" }}
  ],

  "technical_deliverables": [
    // Infrastructure, CI/CD pipelines, DB schemas, API documentation, architecture diagrams
    // Format each as: {{ "item": "name", "description": "details", "format": "how it is delivered" }}
  ],

  "documentation_deliverables": [
    // Technical docs, API docs, deployment runbooks, user manuals, admin guides
    // Format each as: {{ "item": "name", "audience": "who reads it", "format": "Markdown / PDF / Confluence" }}
  ],

  "phase_milestones": [
    // One entry per phase from the budget section
    // Format: {{ "phase": "name", "milestone": "what is delivered", "sign_off_criteria": "how client approves" }}
  ],

  "out_of_scope_callout": [
    // 3-5 items explicitly NOT delivered in this engagement (prevents misalignment)
  ],

  "handover_plan": "Describe the handover process: code repo access, deployment credentials, knowledge transfer sessions, and warranty period."
}}

Be thorough and specific. Every item must reference actual features, tech, or phases from the context.
"""


def build_deliverables_user_msg(accumulated_context: str) -> str:
    return DELIVERABLES_USER_TEMPLATE.format(accumulated_context=accumulated_context)


# Ordered list of (section_name, section_key, section_dict) for the pipeline
SECTION_PIPELINE = [
    ("PURPOSE OF THE DOCUMENT",    "purpose",     d_purpose),
    ("OBJECTIVES",                 "objectives",  d_objectives),
    ("FEATURES AND FUNCTIONALITY", "features",    d_features),
    ("TECHNICAL APPROACH",         "technical",   d_technical),
    ("TECHNOLOGY STACK",           "techstack",   d_techstack),
    ("TIME AND BUDGET ESTIMATE",   "budget",      d_budget),
]
