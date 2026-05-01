from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.proposal import router

app = FastAPI(
    title="Proposal Generator API",
    description="Technical proposal generator powered by GPT-4o-mini — v4",
    version="4.1.0",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React/Vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)


@app.get("/health")
def health():
    return {"status": "ok"}
