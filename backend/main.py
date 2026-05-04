from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import httpx

from database import engine, get_db, Base
from models import FavoriteLocation
from schemas import Location, LocationCreate, WeatherData, ForecastData
from weather_service import weather_service
from fastapi import Depends

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Weather App API", version="1.0.0")

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Weather App API"}

@app.get("/api/weather/coords", response_model=WeatherData)
async def get_weather_by_coords(lat: float, lon: float):
    try:
        return await weather_service.get_weather_by_coords(lat, lon)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=400, detail=f"Weather API error: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/weather/city", response_model=WeatherData)
async def get_weather_by_city(city: str):
    try:
        return await weather_service.get_weather_by_city(city)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=400, detail=f"City not found or API error: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/forecast/coords", response_model=ForecastData)
async def get_forecast_by_coords(lat: float, lon: float):
    try:
        return await weather_service.get_forecast_by_coords(lat, lon)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=400, detail=f"Weather API error: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/forecast/city", response_model=ForecastData)
async def get_forecast_by_city(city: str):
    try:
        return await weather_service.get_forecast_by_city(city)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=400, detail=f"City not found or API error: {e.response.text}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/favorites", response_model=List[Location])
def get_favorites(db: Session = Depends(get_db)):
    return db.query(FavoriteLocation).all()

@app.post("/api/favorites", response_model=Location)
def create_favorite(location: LocationCreate, db: Session = Depends(get_db)):
    existing = db.query(FavoriteLocation).filter(
        FavoriteLocation.city_name == location.city_name,
        FavoriteLocation.country == location.country
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Location already in favorites")

    db_location = FavoriteLocation(**location.model_dump())
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location

@app.delete("/api/favorites/{location_id}")
def delete_favorite(location_id: int, db: Session = Depends(get_db)):
    location = db.query(FavoriteLocation).filter(FavoriteLocation.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    db.delete(location)
    db.commit()
    return {"message": "Location removed from favorites"}
