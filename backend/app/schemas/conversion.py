from pydantic import BaseModel, Field


class ConvertRequest(BaseModel):
    from_currency: str = Field(..., alias="from", min_length=3, max_length=3)
    to_currency: str = Field(..., alias="to", min_length=3, max_length=3)
    amount: float = Field(..., gt=0)

    model_config = {"populate_by_name": True}


class ConvertResponse(BaseModel):
    from_currency: str
    to_currency: str
    amount: float
    rate: float
    converted_amount: float
    timestamp: str
