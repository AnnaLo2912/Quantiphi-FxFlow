from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.services.exchange_rate import get_available_currencies

router = APIRouter()


@router.get("/currencies")
async def list_currencies(db: Session = Depends(get_db)):
    try:
        result = await get_available_currencies(db)
        return result
    except Exception:
        fallback = [
            {"code": "USD", "name": "United States Dollar"},
            {"code": "EUR", "name": "Euro"},
            {"code": "GBP", "name": "British Pound Sterling"},
            {"code": "INR", "name": "Indian Rupee"},
            {"code": "JPY", "name": "Japanese Yen"},
            {"code": "CHF", "name": "Swiss Franc"},
            {"code": "CAD", "name": "Canadian Dollar"},
            {"code": "AUD", "name": "Australian Dollar"},
            {"code": "CNY", "name": "Chinese Yuan"},
            {"code": "BRL", "name": "Brazilian Real"},
        ]
        return {"currencies": fallback}
