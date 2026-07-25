from pathlib import Path
import subprocess


def install_requirements(project_dir: Path):

    repo_dir = project_dir / "repo"

    requirements = repo_dir / "requirements.txt"

    if not requirements.exists():
        return

    pip = project_dir / "venv" / "bin" / "pip"

    subprocess.run(
        [
            str(pip),
            "install",
            "-r",
            str(requirements)
        ],
        check=True
    )