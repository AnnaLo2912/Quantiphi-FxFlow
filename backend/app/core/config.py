import os
import tempfile
from dotenv import load_dotenv

load_dotenv()

FRANKFURTER_BASE_URL = os.getenv("FRANKFURTER_BASE_URL", "https://api.frankfurter.dev/v1")

_default_db = os.getenv("DATABASE_URL", "")
if not _default_db:
    _db_path = os.path.join(tempfile.gettempdir(), "fxflow.db")
    DATABASE_URL = f"sqlite:///{_db_path}"
else:
    DATABASE_URL = _default_db

CACHE_TTL_LIVE = 300  # 5 minutes
CACHE_TTL_HISTORICAL = 3600  # 1 hour

MAJOR_CURRENCIES = ["EUR", "GBP", "INR", "JPY", "CHF"]
