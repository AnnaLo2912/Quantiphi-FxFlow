from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.base import init_db
from app.api import conversion, rates, favorites, history, travel, currencies


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="FxFlow API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(conversion.router, prefix="/api")
app.include_router(rates.router, prefix="/api")
app.include_router(favorites.router, prefix="/api")
app.include_router(history.router, prefix="/api")
app.include_router(travel.router, prefix="/api")
app.include_router(currencies.router, prefix="/api")


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
