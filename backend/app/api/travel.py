from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.schemas.travel import TravelBudgetRequest
from app.services.travel_budget import calculate_travel_budget

router = APIRouter()


@router.post("/travel-budget")
async def travel_budget(body: TravelBudgetRequest, db: Session = Depends(get_db)):
    try:
        result = await calculate_travel_budget(db, body.base_currency.upper(), body.amount)
        return result
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Travel budget calculation failed: {str(e)}")
