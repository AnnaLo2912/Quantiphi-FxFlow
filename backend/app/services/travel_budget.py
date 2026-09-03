from sqlalchemy.orm import Session

from app.core.config import MAJOR_CURRENCIES
from app.services.exchange_rate import get_live_rate


async def calculate_travel_budget(db: Session, base_currency: str, amount: float) -> dict:
    base_currency = base_currency.upper()
    conversions = []

    for currency in MAJOR_CURRENCIES:
        if currency == base_currency:
            conversions.append({"currency": currency, "amount": round(amount, 2)})
            continue
        try:
            rate_data = await get_live_rate(db, base_currency, currency)
            converted = round(amount * rate_data["rate"], 2)
            conversions.append({"currency": currency, "amount": converted})
        except Exception:
            conversions.append({"currency": currency, "amount": 0})

    return {
        "base_currency": base_currency,
        "amount": amount,
        "conversions": conversions,
    }
