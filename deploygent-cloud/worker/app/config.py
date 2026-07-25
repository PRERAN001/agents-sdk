from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

DEPLOYMENTS_DIR = BASE_DIR / "deployments"

DEPLOYMENTS_DIR.mkdir(exist_ok=True)

MONGO_URI = os.getenv("mongodb+srv://preran248:preran123@cluster0.gqh6dfj.mongodb.net/?appName=Cluster0")

HOST = "0.0.0.0"

WORKER_PORT = 5000