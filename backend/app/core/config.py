import os
from dotenv import load_dotenv

load_dotenv()

FRANKFURTER_BASE_URL = os.getenv("FRANKFURTER_BASE_URL", "https://api.frankfurter.dev/v1")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./fxflow.db")

CACHE_TTL_LIVE = 300  # 5 minutes
CACHE_TTL_HISTORICAL = 3600  # 1 hour

MAJOR_CURRENCIES = ["EUR", "GBP", "INR", "JPY", "CHF"]
