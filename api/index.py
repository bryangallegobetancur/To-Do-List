"""Vercel handler: expone la app Flask como serverless function WSGI."""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app import app  # noqa: E402

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
