import json

from .loader import load_agent


def extract_metadata(repo_dir):
    print("extracting meta dataaaaaaaaaaaaa")

    agent = load_agent(
        repo_dir / "agent.py"
    )
    print("recived the agent from the loader",agent)

    metadata = agent.describe()
    print("agent meta data ",metadata)

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
    print("after saving the metadata the file",f)