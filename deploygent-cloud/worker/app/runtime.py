from pathlib import Path
import subprocess

def start_runtime(project_dir: Path, port: int):

    repo = project_dir / "repo"
    python = project_dir / "venv" / "bin" / "python"

    process = subprocess.Popen(
        [
            str(python),
            "-m",
            "deploygent",
            "serve",
            "--path",
            str(repo),
            "--port",
            str(port),
        ],
        cwd=repo,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )

    return process