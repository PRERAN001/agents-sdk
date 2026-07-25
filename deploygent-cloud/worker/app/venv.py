from pathlib import Path
import subprocess


def create_venv(project_dir: Path):
    """
    Creates a virtual environment and installs
    DeployGent + project dependencies.
    """

    venv_dir = project_dir / "venv"

    # Create virtual environment
    subprocess.run(
        ["python3", "-m", "venv", str(venv_dir)],
        check=True
    )

    python = venv_dir / "bin" / "python"
    pip = venv_dir / "bin" / "pip"

    # Upgrade packaging tools
    subprocess.run(
        [
            str(python),
            "-m",
            "pip",
            "install",
            "--upgrade",
            "pip",
            "setuptools",
            "wheel",
        ],
        check=True,
    )

    # Install DeployGent SDK
    subprocess.run(
        [
            str(pip),
            "install",
            "deploygent",
        ],
        check=True,
    )

    # Install project requirements (if present)
    requirements = project_dir / "repo" / "requirements.txt"

    if requirements.exists():
        subprocess.run(
            [
                str(pip),
                "install",
                "-r",
                str(requirements),
            ],
            check=True,
        )

    return python