import json
from datetime import datetime, timedelta, timezone

import httpx
from sqlalchemy.orm import Session

from app.core.config import (
    EXCHANGE_RATE_API_KEY,
    EXCHANGE_RATE_BASE_URL,
    CACHE_TTL_LIVE,
    CACHE_TTL_HISTORICAL,
)
from app.models.rate_cache import RateCache


def _get_cached(db: Session, key: str) -> dict | None:
    row = db.query(RateCache).filter(RateCache.cache_key == key).first()
    if row and row.expires_at > datetime.now(timezone.utc):
        return json.loads(row.data)
    return None


def _set_cache(db: Session, key: str, data: dict, ttl: int):
    existing = db.query(RateCache).filter(RateCache.cache_key == key).first()
    serialized = json.dumps(data)
    expires = datetime.now(timezone.utc) + timedelta(seconds=ttl)
    if existing:
        existing.data = serialized
        existing.expires_at = expires
    else:
        db.add(RateCache(cache_key=key, data=serialized, expires_at=expires))
    db.commit()


async def get_live_rate(db: Session, base: str, target: str) -> dict:
    cache_key = f"live:{base}:{target}"
    cached = _get_cached(db, cache_key)
    if cached:
        return cached

    url = f"{EXCHANGE_RATE_BASE_URL}/{EXCHANGE_RATE_API_KEY}/latest/{base}"
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        data = resp.json()

    if data.get("result") != "success":
        raise Exception(f"API error: {data.get('error-type', 'unknown')}")

    rates = data.get("conversion_rates", {})
    rate = rates.get(target)
    if rate is None:
        raise Exception(f"Currency {target} not found in rates")

    result = {
        "base": base,
        "target": target,
        "rate": rate,
        "timestamp": data.get("time_last_update_utc", ""),
    }
    _set_cache(db, cache_key, result, CACHE_TTL_LIVE)
    return result


async def get_historical_rate(db: Session, base: str, target: str, date_str: str) -> dict:
    cache_key = f"hist:{base}:{target}:{date_str}"
    cached = _get_cached(db, cache_key)
    if cached:
        return cached

    url = f"{EXCHANGE_RATE_BASE_URL}/{EXCHANGE_RATE_API_KEY}/pair/{base}/{target}/{date_str}"
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        data = resp.json()

    if data.get("result") != "success":
        raise Exception(f"API error: {data.get('error-type', 'unknown')}")

    rate = data.get("conversion_rate")
    if rate is None:
        raise Exception(f"No rate data for {date_str}")

    result = {"date": date_str, "rate": rate}
    _set_cache(db, cache_key, result, CACHE_TTL_HISTORICAL)
    return result


async def get_available_currencies(db: Session) -> dict:
    cache_key = "currencies"
    cached = _get_cached(db, cache_key)
    if cached:
        return cached

    url = f"{EXCHANGE_RATE_BASE_URL}/{EXCHANGE_RATE_API_KEY}/codes"
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        data = resp.json()

    if data.get("result") != "success":
        raise Exception("Failed to fetch currencies")

    codes = [{"code": c[0], "name": c[1]} for c in data.get("supported_codes", [])]
    result = {"currencies": codes}
    _set_cache(db, cache_key, result, CACHE_TTL_HISTORICAL)
    return result
