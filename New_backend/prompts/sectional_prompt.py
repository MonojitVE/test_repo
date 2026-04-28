d_purposeofdocument_prompts = {

    "project_name": "Extract or generate a suitable project/product name based on the user's input. Keep it concise and professional.",

    "project_type": "Identify the type of solution (e.g., AI system, POS platform, e-commerce website, SaaS platform, mobile app, internal tool). Keep it short.",

    "primary_problem_or_goal": "Summarize the main problem being solved or the primary goal of the project in one clear sentence.",

    "scope_description": "Describe the scope, objectives, and key capabilities of the system in 2–3 lines based on the project context.",

    "technical_overview": "If the project is technical, describe architecture, stack, and integrations. If not, describe the implementation approach at a high level.",

    "stakeholder_alignment": "Write a paragraph explaining that the document ensures clarity and alignment among stakeholders on scope, approach, expectations, and constraints.",

    "execution_reference": "Write a statement explaining that the document serves as a baseline reference for execution, validation, and acceptance.",

    "future_scope_examples": "Suggest future enhancements only if applicable (e.g., scaling, integrations, AI features, automation). Otherwise, keep it minimal or generic.",

    "final_paragraph": "Generate a closing statement highlighting scalability, flexibility, or maintainability depending on the project type."
}


key_deliverables_prompt = {

    "overall_instruction": "Generate structured Key Deliverables based on the project details. Ensure outputs are domain-agnostic and adaptable to any industry.",

    "key_deliverables": """
Extract and generate a list of core deliverables for the project. These should represent tangible outputs or functional modules that will be delivered in the MVP or main phase.

Guidelines:
- Focus on what will be BUILT or DELIVERED
- Include systems, modules, platforms, integrations, or workflows
- Keep them implementation-focused (not vague objectives)
- Adapt based on project type (web, mobile, AI, SaaS, enterprise, etc.)
- Use clear bullet points

Output Format:
- Deliverable 1
- Deliverable 2
- Deliverable 3
...
""",

    "formatting_rule": """
Return only a bullet list of deliverables.

Do not add headings, explanations, or extra text.
"""
}


d_objective = {
    "Core Functionality": "Primary features specific to the project (e.g., POS checkout, e-commerce flow, AI automation, etc.)",

    "User Management": "Authentication, authorization, roles, and user lifecycle management",

    "Business Logic Engine": "Handles workflows, rules, and domain-specific operations based on project requirements",

    "Data Management": "Database design, storage, retrieval, and data consistency mechanisms",

    "Integration Layer": "Third-party integrations (payments, CRM, APIs, external services, AI models)",

    "User Interface & Experience": "Responsive UI/UX design optimized for target platforms (web, mobile, POS, etc.)",

    "Real-Time Processing": "Live updates, streaming, or low-latency processing where required",

    "Offline Capability (if applicable)": "Offline-first support with synchronization and data reconciliation",

    "AI/Automation Layer (if applicable)": "AI models for prediction, automation, NLP, recommendations, or insights",

    "Analytics & Reporting": "Dashboards, reports, and actionable insights for users/admins",

    "Notification System": "Alerts via email, SMS, WhatsApp, push notifications",

    "Admin & Control Panel": "Backend interface to manage users, data, configurations, and system behavior",

    "Security & Compliance": "Authentication, authorization, encryption, audit logs, and regulatory compliance",

    "Scalability & Architecture": "Modular, scalable system design (e.g., MERN, microservices, multi-tenant)",

    "Performance Optimization": "Caching, efficient queries, fast load times, and system responsiveness",

    "Error Handling & Reliability": "Fallback mechanisms, retries, logging, and system resilience",

    "Monitoring & Logging": "System health tracking, logs, and performance monitoring",

    "Deployment & DevOps": "CI/CD pipelines, cloud deployment, environment configuration",

    "Customization & Configuration": "Ability to adapt system behavior per business/client needs",

    "Multi-Tenancy (if applicable)": "Support multiple clients with isolated data and configurations",

    "Future Extensibility": "API-first and modular design to support future features without rework"
}


d_features_prompts = {

    "overall_intro": "Generate a short introductory line for the 'Features and Functionality' section tailored to the project type.",

    "core_modules": "Identify and group the core modules of the system based on project details (e.g., POS, AI system, website, SaaS). Each module should represent a major functional area.",

    "module_breakdown": "For each module, generate a structured breakdown with sub-features. Use headings, sub-points, and clear categorization similar to a technical proposal.",

    "core_functionality": "Describe the primary system functionality (e.g., checkout flow, AI interaction, website pages, automation workflows) in a structured format.",

    "user_operations": "If applicable, describe user-level operations such as actions users can perform (e.g., cart management, call interaction, dashboard usage).",

    "admin_features": "If applicable, describe admin/back-office capabilities such as configuration, management, reporting, and control panels.",

    "data_and_processing": "Explain how data is handled (e.g., transactions, inventory, AI processing, content management). Include workflows if relevant.",

    "ai_or_automation": "If the project involves AI or automation, describe intelligent features such as predictions, NLP, automation flows, recommendations, or insights.",

    "integration_features": "List integrations such as payment gateways, APIs, CRM systems, messaging platforms, or third-party services.",

    "real_time_or_offline": "If applicable, describe real-time features (live updates, streaming) or offline capabilities (sync, local storage).",

    "security_features": "Describe security-related features such as authentication, authorization, audit logs, and compliance handling.",

    "analytics_reporting": "If applicable, describe dashboards, reports, insights, and performance tracking features.",

    "user_engagement": "If applicable, describe engagement features such as notifications, messaging, loyalty systems, or communication tools.",

    "system_controls": "Describe system-level controls such as configuration, role management, permissions, and customization.",

    "deployment_readiness": "If applicable, include features related to testing, deployment readiness, hardware compatibility, or go-live preparation.",

    "project_specific_features": "Add any domain-specific features based on the project (e.g., hardware integration for POS, voice pipeline for AI, CMS for websites).",

    "formatting_instruction": "Ensure output is structured in numbered sections with clear headings and nested bullet points similar to a professional proposal. Avoid flat lists."
}


d_technical_approach_prompts = {

    "overall_strategy": "Write a short introduction explaining the overall technical approach for building the system based on the project type, scale, and requirements.",

    "requirement_analysis": "If applicable, describe how requirements will be gathered, including stakeholder discussions, goal definition, and planning steps.",

    "system_architecture": "Describe the high-level system architecture. If complex, break into components (frontend, backend, services, integrations). If simple, keep it high-level.",

    "frontend_or_client": "If the project includes a frontend/mobile/POS client, describe the technologies, structure, and key responsibilities (UI, UX, responsiveness, device handling).",

    "backend_services": "Describe backend architecture, APIs, business logic, authentication, and core services. Mention framework and structure (monolith/microservices) if relevant.",

    "database_and_storage": "Suggest suitable databases and storage solutions based on the use case (SQL/NoSQL, caching, object storage) with reasoning.",

    "core_features_implementation": "Explain how key features will be implemented technically (e.g., checkout flow, AI pipeline, workflow engine, inventory logic).",

    "integrations": "Describe third-party integrations (payments, CRM, APIs, AI models, telephony, etc.) and how they will be handled securely.",

    "offline_or_real_time": "If applicable, explain offline-first strategy or real-time processing (sync mechanisms, streaming, queues, etc.). Otherwise, skip or generalize.",

    "eventing_and_background_jobs": "If the system requires async processing, describe background jobs, queues, schedulers, and event-driven components.",

    "security_compliance": "Describe security practices including authentication, authorization, encryption, and compliance considerations.",

    "scalability_design": "Explain how the system will scale (horizontal scaling, load handling, multi-tenancy, modular design). Keep it simple if not needed.",

    "multi_tenancy": "If applicable, describe how multi-tenant architecture will be implemented (data isolation, tenant scoping, access control).",

    "testing_strategy": "Describe testing approach including unit testing, integration testing, and user acceptance testing based on project complexity.",

    "deployment_devops": "Explain deployment strategy (cloud, CI/CD, containerization, environments). Keep it lightweight for small projects.",

    "monitoring_logging": "Describe monitoring, logging, and system observability for tracking performance and errors.",

    "post_launch_support": "Explain post-launch support, maintenance, updates, and iteration strategy.",

    "project_specific_addons": "Based on the project type (AI, POS, website, SaaS), add any special sections like voice pipeline, hardware integration, or CMS setup."
}


d_technology_stack_prompts = {

    "overall_instruction": "Select and generate ONLY ONE best-suited technology per category based on the project requirements. Do not list multiple options.",

    "frontend": "If frontend is required, choose ONE most suitable framework (e.g., React, Next.js, Flutter) based on scalability, performance, and project type.",

    "backend": "Select ONE backend technology including language + framework (e.g., Node.js with Express, Django, FastAPI, Spring Boot).",

    "database": "Select ONE primary database best suited for the project (e.g., PostgreSQL, MongoDB, MySQL).",

    "offline_and_local_storage": "If offline support is needed, select ONE local storage solution (e.g., SQLite, IndexedDB). Otherwise skip.",

    "ai_ml": "If AI/ML is involved, select ONE primary AI technology or platform (e.g., OpenAI API, custom ML model). Otherwise skip.",

    "integrations": "Select ONE primary third-party integration if critical (e.g., Stripe, Razorpay, Twilio).",

    "real_time": "If real-time features exist, select ONE real-time technology (e.g., WebSockets, Firebase). Otherwise skip.",

    "caching": "If caching is needed, select ONE tool (e.g., Redis). Otherwise skip.",

    "storage": "If file/media storage is required, select ONE solution (e.g., AWS S3). Otherwise skip.",

    "authentication": "Select ONE authentication mechanism (e.g., JWT, OAuth).",

    "devops": "Select ONE primary DevOps/deployment approach (e.g., Docker on AWS, Kubernetes).",

    "monitoring": "If monitoring is required, select ONE tool (e.g., Prometheus, Sentry). Otherwise skip.",

    "security": "Select ONE key security implementation (e.g., SSL/TLS, API security layer).",

    "hardware_or_special": "If hardware/IoT is involved, select ONE relevant technology. Otherwise skip.",

    "project_specific": "Select ONE additional technology specific to the project if necessary. Otherwise skip.",

    "formatting_instruction": """
Format the output strictly like this:

● Frontend: <one technology>
● Backend: <one technology>
● Database: <one technology>
● AI & Automation: <one technology> (only if applicable)
● Integrations: <one technology>
● Infrastructure & DevOps: <one technology>
● Security: <one technology>

Rules:
- Only ONE technology per category
- No multiple options, no commas
- Skip categories not relevant
- Do NOT add explanations
"""
}


future_scope_prompt = {

    "overall_instruction": "Generate a Future Scope section based on the project details. Ensure outputs are domain-agnostic and adaptable to any industry.",

    "future_scope": """
Generate a Future Scope section that defines possible enhancements after MVP completion.

Guidelines:
- Focus on scalability, AI upgrades, automation, and platform expansion
- Include advanced features not part of MVP
- Suggest mobile expansion, AI improvements, integrations, analytics, etc.
- Keep it forward-looking and realistic
- Must be relevant to the given project domain

Output Format:
- Future enhancement 1
- Future enhancement 2
- Future enhancement 3
...
""",

    "formatting_rule": """
Return only a bullet list of future enhancements.

Do not add headings, explanations, or extra text.
"""
}


time_budget_prompt = {
    "task": "Generate Time and Budget Estimate section for any type of project",

    "inputs": {
        "project_name": "{user_input}",
        "project_type": "{user_input}",
        "num_phases": "{user_input}",
        "estimated_weeks": "{user_input}",
        "engagement_type": "{user_input}",
        "complexity_note": "{user_input or default: Timeline may vary depending on actual complexity and requirements}",
        "features_summary": "{user_input}",
        "technologies": "{user_input}",
        "resources_required": "{user_input}"
    },

    "template": """TIME AND BUDGET ESTIMATE

The {project_name} ({project_type}) project will be completed in {num_phases} phase(s)
and the ballpark estimate will be {estimated_weeks} weeks ({engagement_type}).

TOTAL PROJECT TIME: Ballpark estimation will be {estimated_weeks} weeks
({engagement_type}) using {technologies}, which may vary depending upon the
actual complexity and requirements. This duration is based on the functionality
and scope mentioned in the document ({features_summary}).

NO. OF RESOURCES REQUIRED: {resources_required}
""",

    "rules": [
        "Works for any project type (software, AI, web, mobile, enterprise, etc.)",
        "Keep tone formal and client-ready",
        "Keep structure exactly as template",
        "Do not add extra sections",
        "Ensure placeholders are filled from user input",
        "Keep it concise and professional"
    ]
}