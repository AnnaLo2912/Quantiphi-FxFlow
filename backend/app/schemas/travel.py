from pydantic import BaseModel, Field


class TravelBudgetRequest(BaseModel):
    base_currency: str = Field(..., min_length=3, max_length=3)
    amount: float = Field(..., gt=0)


class CurrencyConversion(BaseModel):
    currency: str
    amount: float


class TravelBudgetResponse(BaseModel):
    base_currency: str
    amount: float
    conversions: list[CurrencyConversion]
