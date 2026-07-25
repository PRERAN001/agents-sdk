from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId

from .config import MONGO_URI



client = MongoClient("mongodb://localhost:27017")

db = client["deploygent"]

projects = db["projects"]
deployments = db["deployments"]


# ----------------------------
# Projects
# ----------------------------

def create_project(project_id: str, repo_url: str):

    projects.update_one(
        {"_id": project_id},
        {
            "$set": {
                "repo_url": repo_url,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
            }
        },
        upsert=True,
    )


def save_project(project_id: str, repo_url: str, metadata: dict):

    projects.update_one(
        {"_id": project_id},
        {
            "$set": {
                "repo_url": repo_url,
                "metadata": metadata,
                "updated_at": datetime.utcnow(),
            }
        },
        upsert=True,
    )


def get_project(project_id: str):

    return projects.find_one({"_id": project_id})


# ----------------------------
# Deployments
# ----------------------------

def create_deployment(project_id: str, repo_url: str):

    deployment = {
        "project_id": project_id,
        "repo_url": repo_url,
        "status": "queued",
        "port": None,
        "pid": None,
        "metadata": None,
        "logs": [],
        "error": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = deployments.insert_one(deployment)

    return str(result.inserted_id)


def get_deployment(deployment_id: str):

    return deployments.find_one(
        {
            "_id": ObjectId(deployment_id)
        }
    )


def delete_deployment(deployment_id: str):

    deployments.delete_one(
        {
            "_id": ObjectId(deployment_id)
        }
    )


# ----------------------------
# Status
# ----------------------------

def update_status(deployment_id: str, status: str):

    deployments.update_one(
        {
            "_id": ObjectId(deployment_id)
        },
        {
            "$set": {
                "status": status,
                "updated_at": datetime.utcnow(),
            }
        },
    )


# ----------------------------
# Metadata
# ----------------------------

def save_metadata(deployment_id: str, metadata: dict):

    deployments.update_one(
        {
            "_id": ObjectId(deployment_id)
        },
        {
            "$set": {
                "metadata": metadata,
                "updated_at": datetime.utcnow(),
            }
        },
    )


# ----------------------------
# Runtime
# ----------------------------

def save_runtime(
    deployment_id: str,
    port: int,
    pid: int,
):

    deployments.update_one(
        {
            "_id": ObjectId(deployment_id)
        },
        {
            "$set": {
                "port": port,
                "pid": pid,
                "status": "running",
                "updated_at": datetime.utcnow(),
            }
        },
    )


# ----------------------------
# Errors
# ----------------------------

def save_error(
    deployment_id: str,
    error: str,
):

    deployments.update_one(
        {
            "_id": ObjectId(deployment_id)
        },
        {
            "$set": {
                "status": "failed",
                "error": error,
                "updated_at": datetime.utcnow(),
            }
        },
    )


# ----------------------------
# Logs
# ----------------------------

def save_logs(
    deployment_id: str,
    message: str,
):

    deployments.update_one(
        {
            "_id": ObjectId(deployment_id)
        },
        {
            "$push": {
                "logs": {
                    "timestamp": datetime.utcnow(),
                    "message": message,
                }
            },
            "$set": {
                "updated_at": datetime.utcnow(),
            },
        },
    )