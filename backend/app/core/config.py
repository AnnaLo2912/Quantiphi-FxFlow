import os
from dotenv import load_dotenv

load_dotenv()

EXCHANGE_RATE_API_KEY = os.getenv("EXCHANGE_RATE_API_KEY", "")
EXCHANGE_RATE_BASE_URL = os.getenv("EXCHANGE_RATE_BASE_URL", "https://v6.exchangerate-api.com/v6")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./fxflow.db")

CACHE_TTL_LIVE = 300  # 5 minutes
CACHE_TTL_HISTORICAL = 3600  # 1 hour

MAJOR_CURRENCIES = ["EUR", "GBP", "INR", "JPY", "CHF"]
