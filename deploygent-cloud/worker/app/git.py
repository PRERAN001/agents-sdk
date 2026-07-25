from pathlib import Path
import shutil
from uuid import uuid4
from git import Repo

from .config import DEPLOYMENTS_DIR
def clone_repository(repo_url: str, destination: Path):

    if destination.exists():
        shutil.rmtree(destination)

    deployment_folder = DEPLOYMENTS_DIR / str(uuid4())
    repo_dir = deployment_folder / "repo"

    Repo.clone_from(
        repo_url,
        destination
    )

    return destination