from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.services.exchange_rate import get_historical_rate


async def get_historical_data(db: Session, base: str, target: str, days: int = 30) -> dict:
    base = base.upper()
    target = target.upper()
    today = datetime.now(timezone.utc).date()
    data_points = []

    for i in range(days - 1, -1, -1):
        date = today - timedelta(days=i)
        date_str = date.strftime("%Y-%m-%d")
        try:
            rate_data = await get_historical_rate(db, base, target, date_str)
            data_points.append({"date": date_str, "rate": rate_data["rate"]})
        except Exception:
            continue

    return {
        "from": base,
        "to": target,
        "period": f"{days}d",
        "data": data_points,
    }
