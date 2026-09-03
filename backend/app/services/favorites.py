from sqlalchemy.orm import Session

from app.models.favorite import Favorite


def get_favorites(db: Session) -> list[Favorite]:
    return db.query(Favorite).order_by(Favorite.created_at.desc()).all()


def add_favorite(db: Session, source: str, target: str) -> Favorite:
    source = source.upper()
    target = target.upper()

    existing = (
        db.query(Favorite)
        .filter(Favorite.source_currency == source, Favorite.target_currency == target)
        .first()
    )
    if existing:
        raise ValueError("Favorite already exists")

    fav = Favorite(source_currency=source, target_currency=target)
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return fav


def delete_favorite(db: Session, favorite_id: int) -> bool:
    fav = db.query(Favorite).filter(Favorite.id == favorite_id).first()
    if not fav:
        return False
    db.delete(fav)
    db.commit()
    return True
