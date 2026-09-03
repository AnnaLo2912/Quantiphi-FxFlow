import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database.base import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_health_check():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_get_favorites_empty():
    resp = client.get("/api/favorites")
    assert resp.status_code == 200
    assert resp.json() == []


def test_add_favorite():
    resp = client.post("/api/favorites", json={"from": "USD", "to": "INR"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["source_currency"] == "USD"
    assert data["target_currency"] == "INR"


def test_duplicate_favorite():
    client.post("/api/favorites", json={"from": "USD", "to": "INR"})
    resp = client.post("/api/favorites", json={"from": "USD", "to": "INR"})
    assert resp.status_code == 409


def test_delete_favorite():
    resp = client.post("/api/favorites", json={"from": "EUR", "to": "USD"})
    fav_id = resp.json()["id"]
    resp = client.delete(f"/api/favorites/{fav_id}")
    assert resp.status_code == 200


def test_delete_nonexistent_favorite():
    resp = client.delete("/api/favorites/99999")
    assert resp.status_code == 404


def test_get_conversion_history():
    resp = client.get("/api/conversions")
    assert resp.status_code == 200
    assert "conversions" in resp.json()


def test_convert_invalid_amount():
    resp = client.get("/api/convert?from=USD&to=INR&amount=-5")
    assert resp.status_code == 422


def test_convert_invalid_currency():
    resp = client.get("/api/convert?from=USDX&to=INR&amount=100")
    assert resp.status_code == 422


def test_travel_budget_invalid_amount():
    resp = client.post("/api/travel-budget", json={"base_currency": "USD", "amount": -100})
    assert resp.status_code == 422
