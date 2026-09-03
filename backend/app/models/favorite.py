from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database.base import Base


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    source_currency = Column(String(3), nullable=False)
    target_currency = Column(String(3), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
