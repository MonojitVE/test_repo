# Proposal Generator v4 — Modular FastAPI

Refactored from `ProposalGenerator_v4_1.ipynb`. **No code was changed** — only reorganised into a proper Python package with a FastAPI backend.

---

## Project Structure

```
proposal_generator/
├── main.py                          # FastAPI app entry point
├── requirements.txt
├── .env.example                     # Copy to .env and add your key
│
└── app/
    ├── core/
    │   ├── config.py                # Env vars, OpenAI client, company constants
    │   └── llm.py                   # call_llm() + clean_json() utilities
    │
    ├── prompts/
    │   ├── parser.py                # PARSER_SYSTEM + PARSER_USER_TEMPLATE
    │   └── sections.py              # All 6 section dicts + deliverables prompts + SECTION_PIPELINE
    │
    ├── services/
    │   ├── parser_service.py        # parse_user_prompt()
    │   ├── section_service.py       # generate_section_json()
    │   ├── deliverables_service.py  # generate_deliverables()
    │   ├── html_service.py          # val_to_html(), section_card(), build_html()
    │   └── proposal_service.py      # run_full_pipeline() — orchestrates everything
    │
    └── api/
        └── routes/
            └── proposal.py          # POST /proposal/generate
                                     # POST /proposal/generate/html
```

---

## Setup

```bash
cp .env.example .env
# Add your OPENAI_API_KEY to .env

pip install -r requirements.txt
```

---

## Run

```bash
uvicorn main:app --reload
```

API docs available at: http://localhost:8000/docs

---

## Endpoints

| Method | Path | Returns |
|--------|------|---------|
| `POST` | `/proposal/generate` | Full proposal as JSON |
| `POST` | `/proposal/generate/html` | Styled HTML document |
| `GET`  | `/health` | `{"status": "ok"}` |

### Request body

```json
{
  "prompt": "Need to build an e-commerce platform for adventure sports using React and Python..."
}
```

---

## How the pipeline maps to the original notebook

| Notebook cell | Module |
|---|---|
| Step 0 — NLP Prompt Parser | `app/services/parser_service.py` |
| Section prompt dictionaries | `app/prompts/sections.py` |
| Core Engine (`generate_section_json`) | `app/services/section_service.py` |
| Sections 1–6 execution | `app/services/proposal_service.py` |
| Section 7 — Key Deliverables | `app/services/deliverables_service.py` |
| Full Proposal JSON assembly | `app/services/proposal_service.py` |
| HTML export (`val_to_html`, `build_html`) | `app/services/html_service.py` |
| `call_llm` + `clean_json` | `app/core/llm.py` |
| OpenAI client + env | `app/core/config.py` |
