from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.services.conversion import convert

router = APIRouter()


@router.get("/convert")
async def convert_currency(
    from_currency: str = Query(..., alias="from", min_length=3, max_length=3),
    to_currency: str = Query(..., alias="to", min_length=3, max_length=3),
    amount: float = Query(..., gt=0),
    db: Session = Depends(get_db),
):
    try:
        result = await convert(db, from_currency, to_currency, amount)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Exchange rate service error: {str(e)}")
