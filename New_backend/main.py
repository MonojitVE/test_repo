import sys
import os


from pipeline import generate_proposal
from utils.file_utils import save_proposal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel



# user_input = """
# Need to run a log normal and Monte Carlo Simulation using Python
# when analysing the percentage of a hedge Fund
# """

app = FastAPI(title="Proposal Generator API")



# ----------------- SCHEMAS ------------------

# Request Schema
class ProposalRequest(BaseModel):
    # use_input: str
    description: str
    project_type: str
    industry: str
    timeline:str
    budget:str
    phases:str
    resources: str

# Response Schema
class ProposalResponse(BaseModel):
    proposal_text: str



# ------------ ROUTES -------------

@app.get("/health")
def check_health():
    return {"message":"app running"}


@app.post("/generate", response_model=ProposalResponse)
def run_pipeline(req: ProposalRequest):
    try:
        if not req.description.strip():
            raise HTTPException(status_code=400, detail="Description is required")

        # Structured enriched input
        enriched_input = f"""
Project Description: {req.description}
{f"Project Type: {req.project_type}" if req.project_type else ""}
{f"Industry: {req.industry}" if req.industry else ""}
""".strip()

        proposal_text = generate_proposal(
            enriched_input,
            user_timeline=req.timeline,
            user_budget=req.budget,
            user_phases=req.phases,
            user_resources=req.resources
        )

        return ProposalResponse(proposal_text=proposal_text)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))