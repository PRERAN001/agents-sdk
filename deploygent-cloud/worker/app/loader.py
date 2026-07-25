import importlib.util
import os


def load_agent():

    path = os.path.join(
        os.getcwd(),
        "agent.py"
    )

    if not os.path.exists(path):
        raise FileNotFoundError(
            "agent.py not found"
        )

    spec = importlib.util.spec_from_file_location(
        "agent",
        path
    )

    module = importlib.util.module_from_spec(spec)

    spec.loader.exec_module(module)

    return module.agent