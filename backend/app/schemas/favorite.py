from pydantic import BaseModel, Field
from datetime import datetime


class FavoriteCreate(BaseModel):
    from_currency: str = Field(..., alias="from", min_length=3, max_length=3)
    to_currency: str = Field(..., alias="to", min_length=3, max_length=3)

    model_config = {"populate_by_name": True}


class FavoriteResponse(BaseModel):
    id: int
    source_currency: str
    target_currency: str
    created_at: datetime
