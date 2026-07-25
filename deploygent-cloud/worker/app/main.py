from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from .deploy import deploy_project

app = FastAPI(
    title="DeployGent Worker"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DeployRequest(BaseModel):
    project_id: str
    repo_url: str


@app.get("/")
def home():
    return {
        "status": "running"
    }


@app.post("/deploy",)
def deploy(request: DeployRequest):
    return deploy_project(
        request.project_id,
        request.repo_url
    )