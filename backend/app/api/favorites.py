from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.schemas.favorite import FavoriteCreate
from app.services.favorites import get_favorites, add_favorite, delete_favorite

router = APIRouter()


@router.get("/favorites")
def list_favorites(db: Session = Depends(get_db)):
    favs = get_favorites(db)
    return [
        {
            "id": f.id,
            "source_currency": f.source_currency,
            "target_currency": f.target_currency,
            "created_at": f.created_at.isoformat(),
        }
        for f in favs
    ]


@router.post("/favorites", status_code=201)
def create_favorite(body: FavoriteCreate, db: Session = Depends(get_db)):
    try:
        fav = add_favorite(db, body.from_currency.upper(), body.to_currency.upper())
        return {
            "id": fav.id,
            "source_currency": fav.source_currency,
            "target_currency": fav.target_currency,
            "created_at": fav.created_at.isoformat(),
        }
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.delete("/favorites/{favorite_id}")
def remove_favorite(favorite_id: int, db: Session = Depends(get_db)):
    deleted = delete_favorite(db, favorite_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"message": "Favorite deleted"}
