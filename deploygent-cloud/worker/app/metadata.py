import json

from .loader import load_agent


def extract_metadata(repo_dir):

    agent = load_agent(
        repo_dir / "agent.py"
    )

    metadata = agent.describe()

    return metadata


def save_metadata_file(
    project_dir,
    metadata
):

    with open(
        project_dir / "metadata.json",
        "w"
    ) as f:

        json.dump(
            metadata,
            f,
            indent=4
        )