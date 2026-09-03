from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database.base import Base


class ConversionHistory(Base):
    __tablename__ = "conversion_history"

    id = Column(Integer, primary_key=True, index=True)
    source_currency = Column(String(3), nullable=False)
    target_currency = Column(String(3), nullable=False)
    amount = Column(Float, nullable=False)
    converted_amount = Column(Float, nullable=False)
    exchange_rate = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
