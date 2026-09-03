from pydantic import BaseModel
from datetime import datetime


class HistoryPoint(BaseModel):
    date: str
    rate: float


class HistoryResponse(BaseModel):
    from_currency: str
    to_currency: str
    period: str
    data: list[HistoryPoint]


class ConversionRecord(BaseModel):
    id: int
    source_currency: str
    target_currency: str
    amount: float
    converted_amount: float
    exchange_rate: float
    created_at: datetime


class ConversionHistoryResponse(BaseModel):
    conversions: list[ConversionRecord]
