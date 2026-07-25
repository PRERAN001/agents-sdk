from pathlib import Path

from .config import DEPLOYMENTS_DIR
from .git import clone_repository
from .venv import create_virtual_environment
from .requirements import install_requirements
from .metadata import (
    extract_metadata,
    save_metadata_file,
)
from .ports import get_free_port
from .runtime import start_runtime
from .database import (
    create_deployment,
    save_project,
    save_metadata,
    save_runtime,
    update_status,
    save_error,
)

import traceback

def deploy_project(project_id: str, repo_url: str):

    deployment_id = None

    try:

      
        deployment_id = create_deployment(
            project_id,
            repo_url,
        )

        project_dir = DEPLOYMENTS_DIR / project_id
        repo_dir = project_dir / "repo"

        project_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        

        update_status(
            deployment_id,
            "cloning",
        )

        clone_repository(
            repo_url,
            repo_dir,
        )

        print("creating_venv")
        update_status(
            deployment_id,
            "creating_venv",
        )

        create_virtual_environment(
            project_dir,
        )

       
        print("installing_dependencies")
        update_status(
            deployment_id,
            "installing_dependencies",
        )

        install_requirements(
            project_dir,
        )

        print("extracting_metadata")

        update_status(
            deployment_id,
            "extracting_metadata",
        )

        metadata = extract_metadata(
            repo_dir,
        )

        save_metadata_file(
            project_dir,
            metadata,
        )

        save_project(
            project_id,
            repo_url,
            metadata,
        )

        save_metadata(
            deployment_id,
            metadata,
        )

        # ----------------------------
        # Allocate Port
        # ----------------------------

        update_status(
            deployment_id,
            "allocating_port",
        )

        port = get_free_port()

        # ----------------------------
        # Start Runtime
        # ----------------------------

        update_status(
            deployment_id,
            "starting_runtime",
        )

        process = start_runtime(
            project_dir,
            port,
        )

        save_runtime(
            deployment_id,
            port,
            process.pid,
        )

        update_status(
            deployment_id,
            "running",
        )

        return {
            "success": True,
            "deployment_id": deployment_id,
            "project_id": project_id,
            "status": "running",
            "port": port,
            "pid": process.pid,
            "metadata": metadata,
        }

    except Exception as e:

        # if deployment_id is not None:
        #     save_error(
        #         deployment_id,
        #         str(e),
        #     )

        # return {
        #     "success": False,
        #     "deployment_id": deployment_id,
        #     "error": str(e),
        # }
        traceback.print_exc()
        print(repr(e))
        raise