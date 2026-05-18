from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.proposal_service import run_full_pipeline

router = APIRouter(prefix="/proposal", tags=["proposal"])


class ProposalRequest(BaseModel):
    prompt: str


class ProposalResponse(BaseModel):
    full_proposal: dict


@router.post("/generate", response_model=ProposalResponse)
def generate_proposal(body: ProposalRequest):
    """
    Run the full proposal pipeline and return the structured JSON proposal.
    """
    if not body.prompt.strip():
        raise HTTPException(status_code=400, detail="prompt cannot be empty")

    result = run_full_pipeline(body.prompt)
    return ProposalResponse(full_proposal=result["full_proposal"])
