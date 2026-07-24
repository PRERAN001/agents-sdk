from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn


class RunRequest(BaseModel):
    task: str
    inputs: dict = {}


def start_runtime(agent, host="0.0.0.0", port=8000):
    app = FastAPI(
        title=agent.name,
        version=agent.version
    )

    @app.get("/")
    def root():
        return {
            "name": agent.name,
            "version": agent.version,
            "status": "running"
        }

    @app.get("/health")
    def health():
        return {
            "status": "healthy"
        }

    @app.get("/metadata")
    def metadata():
        return agent.describe()

    @app.get("/tasks")
    def tasks():
        return [
            task.name
            for task in agent.tasks
        ]

    @app.post("/run")
    def run(request: RunRequest):

        try:

            result = agent.run(
                request.task,
                request.inputs
            )

            return {
                "success": True,
                "task": request.task,
                "result": result
            }

        except Exception as e:

            raise HTTPException(
                status_code=500,
                detail=str(e)
            )

    uvicorn.run(
        app,
        host=host,
        port=port
    )