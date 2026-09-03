from sqlalchemy.orm import Session

from app.services.exchange_rate import get_live_rate
from app.models.conversion_history import ConversionHistory

VALID_CURRENCIES = None  # validated at runtime via API


def validate_currency(code: str) -> bool:
    return isinstance(code, str) and len(code) == 3 and code.isalpha() and code.isupper()


async def convert(db: Session, from_currency: str, to_currency: str, amount: float) -> dict:
    from_currency = from_currency.upper()
    to_currency = to_currency.upper()

    if not validate_currency(from_currency):
        raise ValueError(f"Invalid source currency: {from_currency}")
    if not validate_currency(to_currency):
        raise ValueError(f"Invalid target currency: {to_currency}")
    if amount <= 0:
        raise ValueError("Amount must be greater than zero")

    rate_data = await get_live_rate(db, from_currency, to_currency)
    rate = rate_data["rate"]
    converted = round(amount * rate, 2)

    record = ConversionHistory(
        source_currency=from_currency,
        target_currency=to_currency,
        amount=amount,
        converted_amount=converted,
        exchange_rate=rate,
    )
    db.add(record)
    db.commit()

    return {
        "from": from_currency,
        "to": to_currency,
        "amount": amount,
        "rate": rate,
        "converted_amount": converted,
        "timestamp": rate_data["timestamp"],
    }
