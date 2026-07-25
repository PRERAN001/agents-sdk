from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from .deploy import deploy_project
from fastapi import HTTPException
from .database import deployments
from bson import ObjectId
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

@app.get("/deployment/{id}")
def get_deployment(id: str):
    deployment = deployments.find_one({"_id": ObjectId(id)})

    if not deployment:
        raise HTTPException(status_code=404, detail="Deployment not found")

    deployment["_id"] = str(deployment["_id"])

    return deployment
@app.get("/projects")
def get_projects():
    return list(
        deployments.find(
            {},
            {"_id": 0}
        )
    )

@app.get("/dashboard")
def dashboard():

    total_projects = deployments.count_documents({})

    running = deployments.count_documents({
        "status": "running"
    })

    stopped = deployments.count_documents({
        "status": "stopped"
    })

    deployments_count = deployments.count_documents({})

    return {
        "projects": total_projects,
        "running": running,
        "stopped": stopped,
        "deployments": deployments_count
    }