import importlib.util
from pathlib import Path


def load_agent(path):
    print("=" * 60)
    print("[Loader] Starting agent loading")
    print(f"[Loader] Input path: {path}")

    path = Path(path)

    print(f"[Loader] Resolved path: {path.resolve()}")

    if not path.exists():
        print("[Loader] ERROR: File does not exist!")
        raise FileNotFoundError(f"{path} not found")

    print("[Loader] File exists")

    print("[Loader] Creating module spec...")
    spec = importlib.util.spec_from_file_location(
        "agent",
        str(path)
    )

    if spec is None:
        print("[Loader] ERROR: Failed to create module spec")
        raise RuntimeError("Could not create module spec")

    print("[Loader] Module spec created")

    print("[Loader] Creating module...")
    module = importlib.util.module_from_spec(spec)

    print("[Loader] Module created")

    if spec.loader is None:
        print("[Loader] ERROR: spec.loader is None")
        raise RuntimeError("Module loader is None")

    print("[Loader] Executing module...")
    spec.loader.exec_module(module)
    print("[Loader] Module execution completed")

    print("[Loader] Looking for 'agent' object...")

    if not hasattr(module, "agent"):
        print("[Loader] ERROR: No 'agent' object found")
        print("[Loader] Available attributes:")
        print(dir(module))
        raise AttributeError("Module does not contain an 'agent' object")

    print("[Loader] Agent found successfully")
    print(f"[Loader] Agent type: {type(module.agent)}")
    print("=" * 60)

    return module.agent