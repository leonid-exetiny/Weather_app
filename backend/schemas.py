from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LocationBase(BaseModel):
    city_name: str
    country: str
    lat: float
    lon: float

class LocationCreate(LocationBase):
    pass

class Location(LocationBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class WeatherData(BaseModel):
    temp: float
    feels_like: float
    temp_min: float
    temp_max: float
    pressure: int
    humidity: int
    description: str
    icon: str
    wind_speed: float
    clouds: int
    city_name: str
    country: str

class ForecastItem(BaseModel):
    dt: int
    temp: float
    feels_like: float
    temp_min: float
    temp_max: float
    pressure: int
    humidity: int
    description: str
    icon: str
    wind_speed: float
    clouds: int
    dt_txt: str

class ForecastData(BaseModel):
    city_name: str
    country: str
    forecast: list[ForecastItem]
