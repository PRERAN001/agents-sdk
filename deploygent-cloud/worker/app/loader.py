import importlib.util
from pathlib import Path


def load_agent(path):
    print("load agent ",path)
    path = Path(path)

    if not path.exists():
        raise FileNotFoundError(
            f"{path} not found"
        )

    spec = importlib.util.spec_from_file_location(
        "agent",
        str(path)
    )

    module = importlib.util.module_from_spec(spec)

    spec.loader.exec_module(module)

    return module.agent