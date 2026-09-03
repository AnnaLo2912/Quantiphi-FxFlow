from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.models.conversion_history import ConversionHistory

router = APIRouter()


@router.get("/conversions")
def get_conversion_history(db: Session = Depends(get_db)):
    records = (
        db.query(ConversionHistory)
        .order_by(ConversionHistory.created_at.desc())
        .limit(20)
        .all()
    )
    return {
        "conversions": [
            {
                "id": r.id,
                "source_currency": r.source_currency,
                "target_currency": r.target_currency,
                "amount": r.amount,
                "converted_amount": r.converted_amount,
                "exchange_rate": r.exchange_rate,
                "created_at": r.created_at.isoformat(),
            }
            for r in records
        ]
    }
