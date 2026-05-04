from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base

class FavoriteLocation(Base):
    __tablename__ = "favorite_locations"

    id = Column(Integer, primary_key=True, index=True)
    city_name = Column(String, nullable=False)
    country = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
