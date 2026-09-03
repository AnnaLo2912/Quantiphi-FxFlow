from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.services.exchange_rate import get_historical_data

router = APIRouter()


@router.get("/history")
async def get_history(
    from_currency: str = Query(..., alias="from", min_length=3, max_length=3),
    to_currency: str = Query(..., alias="to", min_length=3, max_length=3),
    days: int = Query(30, ge=1, le=90),
    db: Session = Depends(get_db),
):
    try:
        result = await get_historical_data(db, from_currency, to_currency, days)
        return result
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch historical data: {str(e)}")
