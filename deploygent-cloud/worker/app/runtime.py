from pathlib import Path
import subprocess
import time


def start_runtime(project_dir: Path, port: int):
    print("ENTERED start_runtime")
    repo = project_dir / "repo"
    python = project_dir / "venv" / "bin" / "python"

    process = subprocess.Popen(
    [
        str(python),
        "-m",
        "deploygent",
        "serve",
        "--host",
        "0.0.0.0",
        "--port",
        str(port),
    ],
    cwd=repo,
)

    # Give the runtime a moment to start
    time.sleep(2)

    # If it exited immediately, print why
    if process.poll() is not None:
        stdout, stderr = process.communicate()

        print("===== RUNTIME FAILED =====")
        print(f"Exit Code: {process.returncode}")

        print("\n===== STDOUT =====")
        print(stdout)

        print("\n===== STDERR =====")
        print(stderr)

        raise RuntimeError("Runtime failed to start.")

    return process