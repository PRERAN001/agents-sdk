import sys
import subprocess
from pathlib import Path


def create_virtual_environment(project_dir: Path):
    venv_path = project_dir / "venv"

    cmd = [
    sys.executable,
    "-m",
    "venv",
    str(venv_path),
]

    print("Running:", cmd)

    subprocess.run(cmd, check=True) 

    return venv_path