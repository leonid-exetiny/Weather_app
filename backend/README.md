# Weather App Backend

FastAPI backend for the Weather App with OpenWeatherMap API integration.

## Features

- RESTful API endpoints for weather data
- SQLite database for favorite locations
- Async HTTP requests with httpx
- CORS middleware for frontend integration
- Pydantic data validation
- OpenAPI documentation (Swagger UI)

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

Create a `.env` file in the backend directory:

```env
OPENWEATHER_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///./weather.db
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Running the Server

```bash
# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Run development server
uvicorn main:app --reload

# Run on specific host and port
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Project Structure

```
backend/
├── main.py              # FastAPI app and routes
├── config.py            # Settings and configuration
├── database.py          # Database setup
├── models.py            # SQLAlchemy models
├── schemas.py           # Pydantic schemas
├── weather_service.py   # Weather API service
├── requirements.txt     # Python dependencies
└── .env                 # Environment variables (not in git)
```

## Dependencies

- **fastapi** - Web framework
- **uvicorn** - ASGI server
- **sqlalchemy** - ORM
- **pydantic** - Data validation
- **httpx** - Async HTTP client
- **python-dotenv** - Environment variables

## Database

The app uses SQLite for storing favorite locations. The database is automatically created on first run.

To reset the database, simply delete `weather.db` and restart the server.
