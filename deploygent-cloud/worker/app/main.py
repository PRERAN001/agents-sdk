from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from .deploy import deploy_project
from fastapi import HTTPException
from .database import deployments
from bson import ObjectId

import shutil
import psutil
app = FastAPI(
    title="DeployGent Worker"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
            # Next.js
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

@app.get("/deployment/{project_id}")
def get_deployment(project_id: str):
    deployment = deployments.find_one({"project_id": project_id})

    if not deployment:
        raise HTTPException(status_code=404, detail="Deployment not found")

    return {
        "id": deployment["project_id"],
        "repo_url": deployment["repo_url"],
        "status": deployment["status"],
        "runtime": {
            "port": deployment["port"],
            "pid": deployment["pid"],
            "url": f"http://16.16.110.104:{deployment['port']}"
        },
        "metadata": deployment["metadata"]
    }
@app.get("/projects")
def get_projects():
    return list(
        deployments.find(
            {},
            {"_id": 0}
        )
    )


@app.delete("/projects/{project_id}")
def delete_project(project_id: str):

    project = deployments.projects.find_one({"_id": ObjectId(project_id)})

    if not project:
        raise HTTPException(404, "Project not found")

    pid = project.get("pid")

    if pid:
        try:
            psutil.Process(pid).kill()
        except Exception:
            pass

    deployment_path = project["path"]

    shutil.rmtree(deployment_path, ignore_errors=True)

    deployments.projects.delete_one({"_id": ObjectId(project_id)})

    return {
        "success": True
    }
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
from .database import deployments

@app.get("/deployments")
def get_deployments():
    docs = list(deployments.find())

    for doc in docs:
        doc["_id"] = str(doc["_id"])

    return docs