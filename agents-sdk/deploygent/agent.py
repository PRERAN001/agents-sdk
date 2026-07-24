from .tasks import Task
from .env import Env
import inspect
from flask import Flask, request, jsonify
from .runtime import start_runtime
class Agent:

    def __init__(self, name, version="1.0"):
        self.name = name
        self.version = version
        self.tasks = []
        self.envs=[]

    def task(self,func):
        task1=Task(func)
        self.tasks.append(task1)
        return func

    def env(self,envv):
        env1=Env(envv)
        self.envs.append(env1)
    def run(self,task_name,inputs):
        for tasks in self.tasks:
            if tasks.name==task_name:
                return tasks(*inputs)

    

    def describe(self):
        tasks = []

        for task in self.tasks:
            signature = inspect.signature(task.func)
            output = signature.return_annotation

            inputs = []
           

            for name, parameter in signature.parameters.items():
                annotation = parameter.annotation

                inputs.append({
                    "name": name,
                    "type": getattr(annotation, "type", "unknown"),
                    "label": getattr(annotation, "label", name),
                    "required": getattr(annotation, "required", True),
                })
            output = {
    "type": getattr(signature.return_annotation, "type", "unknown")
}

            tasks.append({
                "name": task.name,
                "inputs": inputs,
                "outputs": output,
            })

        return {
            "name": self.name,
            "version": self.version,
            "tasks": tasks,
            "envs": [
                {
                    "name": env.name,
                    "required": env.required,
                    "description": env.description,
                }
                for env in self.envs
            ]
        }

    def serve(
        self,
        host="0.0.0.0",
        port=8000
    ):
        start_runtime(
            self,
            host,
            port
        )