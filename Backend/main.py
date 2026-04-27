import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, ConfigDict
from pipeline import generate_proposal
from pdf_generator import create_proposal_pdf
import io
import uvicorn

app = FastAPI(title="Proposal Generator API")

# ✅ CORS (same as before)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ SCHEMAS ------------------ #
class ProposalRequest(BaseModel):
    model_config = ConfigDict(extra='ignore')

    description: str = ""
    proposal_text: str = ""   # ✅ added (important fix)

    project_type: str = ""
    industry: str = ""
    timeline: str = ""
    budget: str = ""
    phases: str = ""
    resources: str = ""
    client_name: str = ""
    extra_requirements: str = ""


class ProposalResponse(BaseModel):
    proposal_text: str


# ------------------ ROUTES ------------------ #
@app.get("/health")
def root():
    return {"status": "Proposal Generator API is running"}


@app.post("/generate", response_model=ProposalResponse)
def generate(req: ProposalRequest):
    if not req.description.strip():
        raise HTTPException(status_code=400, detail="Project description is required.")

    enriched_input = f"""
Project Description: {req.description}
{f"Project Type: {req.project_type}" if req.project_type else ""}
{f"Industry/Domain: {req.industry}" if req.industry else ""}
{f"Client: {req.client_name}" if req.client_name else ""}
{f"Additional Requirements: {req.extra_requirements}" if req.extra_requirements else ""}
""".strip()

    try:
        proposal_text = generate_proposal(
            enriched_input,
            user_timeline=req.timeline,
            user_budget=req.budget,
            user_phases=req.phases,
            user_resources=req.resources,
        )

        return ProposalResponse(proposal_text=proposal_text)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ FIXED: No regeneration happens here
@app.post("/generate-pdf")
def generate_pdf(req: ProposalRequest):

    if not req.proposal_text.strip():
        raise HTTPException(status_code=400, detail="Proposal text is required.")

    try:
        pdf_bytes = create_proposal_pdf(
            proposal_text=req.proposal_text,
            client_name=req.client_name,
            project_title=req.project_type
        )

        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=proposal.pdf"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ------------------ RUN ------------------ #
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)