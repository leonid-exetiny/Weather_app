import httpx
from config import settings
from schemas import WeatherData, ForecastData, ForecastItem

class WeatherService:
    BASE_URL = "https://api.openweathermap.org/data/2.5"

    def __init__(self):
        self.api_key = settings.OPENWEATHER_API_KEY

    async def get_weather_by_coords(self, lat: float, lon: float) -> WeatherData:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/weather",
                params={
                    "lat": lat,
                    "lon": lon,
                    "appid": self.api_key,
                    "units": "metric"
                }
            )
            response.raise_for_status()
            data = response.json()

            return WeatherData(
                temp=data["main"]["temp"],
                feels_like=data["main"]["feels_like"],
                temp_min=data["main"]["temp_min"],
                temp_max=data["main"]["temp_max"],
                pressure=data["main"]["pressure"],
                humidity=data["main"]["humidity"],
                description=data["weather"][0]["description"],
                icon=data["weather"][0]["icon"],
                wind_speed=data["wind"]["speed"],
                clouds=data["clouds"]["all"],
                city_name=data["name"],
                country=data["sys"]["country"]
            )

    async def get_weather_by_city(self, city: str) -> WeatherData:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/weather",
                params={
                    "q": city,
                    "appid": self.api_key,
                    "units": "metric"
                }
            )
            response.raise_for_status()
            data = response.json()

            return WeatherData(
                temp=data["main"]["temp"],
                feels_like=data["main"]["feels_like"],
                temp_min=data["main"]["temp_min"],
                temp_max=data["main"]["temp_max"],
                pressure=data["main"]["pressure"],
                humidity=data["main"]["humidity"],
                description=data["weather"][0]["description"],
                icon=data["weather"][0]["icon"],
                wind_speed=data["wind"]["speed"],
                clouds=data["clouds"]["all"],
                city_name=data["name"],
                country=data["sys"]["country"]
            )

    async def get_forecast_by_coords(self, lat: float, lon: float) -> ForecastData:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/forecast",
                params={
                    "lat": lat,
                    "lon": lon,
                    "appid": self.api_key,
                    "units": "metric"
                }
            )
            response.raise_for_status()
            data = response.json()

            forecast_items = []
            for item in data["list"]:
                forecast_items.append(ForecastItem(
                    dt=item["dt"],
                    temp=item["main"]["temp"],
                    feels_like=item["main"]["feels_like"],
                    temp_min=item["main"]["temp_min"],
                    temp_max=item["main"]["temp_max"],
                    pressure=item["main"]["pressure"],
                    humidity=item["main"]["humidity"],
                    description=item["weather"][0]["description"],
                    icon=item["weather"][0]["icon"],
                    wind_speed=item["wind"]["speed"],
                    clouds=item["clouds"]["all"],
                    dt_txt=item["dt_txt"]
                ))

            return ForecastData(
                city_name=data["city"]["name"],
                country=data["city"]["country"],
                forecast=forecast_items
            )

    async def get_forecast_by_city(self, city: str) -> ForecastData:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/forecast",
                params={
                    "q": city,
                    "appid": self.api_key,
                    "units": "metric"
                }
            )
            response.raise_for_status()
            data = response.json()

            forecast_items = []
            for item in data["list"]:
                forecast_items.append(ForecastItem(
                    dt=item["dt"],
                    temp=item["main"]["temp"],
                    feels_like=item["main"]["feels_like"],
                    temp_min=item["main"]["temp_min"],
                    temp_max=item["main"]["temp_max"],
                    pressure=item["main"]["pressure"],
                    humidity=item["main"]["humidity"],
                    description=item["weather"][0]["description"],
                    icon=item["weather"][0]["icon"],
                    wind_speed=item["wind"]["speed"],
                    clouds=item["clouds"]["all"],
                    dt_txt=item["dt_txt"]
                ))

            return ForecastData(
                city_name=data["city"]["name"],
                country=data["city"]["country"],
                forecast=forecast_items
            )

weather_service = WeatherService()
