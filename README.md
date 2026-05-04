# 🌤️ Weather App

Modern fullstack weather application with real-time weather data, 5-day forecasts, and geolocation support. Built with FastAPI and React.

![Weather App](https://img.shields.io/badge/FastAPI-0.115.0-009688?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-19.2.5-61DAFB?style=flat-square&logo=react)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python)

## ✨ Features

- 🌍 **Real-time Weather Data** - Current weather conditions for any location
- 📅 **5-Day Forecast** - Detailed hourly and daily weather predictions
- 📍 **Geolocation Support** - Automatic weather detection based on your location
- 🔍 **City Search** - Search weather by city name worldwide
- ⭐ **Favorite Locations** - Save and quickly access your favorite cities
- 🌐 **Multi-language Support** - English, Russian, Spanish, and French
- 🎨 **Modern UI** - Smooth animations with Framer Motion
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

## 🏗️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation using Python type annotations
- **httpx** - Async HTTP client for API requests
- **SQLite** - Lightweight database for favorites storage
- **Uvicorn** - ASGI server

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **Framer Motion** - Animation library
- **CSS3** - Modern styling with animations

### External API
- **OpenWeatherMap API** - Weather data provider

## 📋 Prerequisites

- Python 3.9 or higher
- Node.js 16 or higher
- npm or yarn
- OpenWeatherMap API key (free tier available)

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/leonid-exetiny/Weather_app.git
cd weather-app
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Edit `.env` file and add your OpenWeatherMap API key:

```env
OPENWEATHER_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///./weather.db
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174
```

Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
echo "VITE_API_URL=http://localhost:8000" > .env
```

## 🎯 Running the Application

### Start Backend Server

```bash
cd backend
# Make sure virtual environment is activated
uvicorn main:app --reload
```

Backend will run on `http://localhost:8000`

API documentation available at `http://localhost:8000/docs`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### Weather Endpoints

- `GET /api/weather/coords?lat={lat}&lon={lon}` - Get current weather by coordinates
- `GET /api/weather/city?city={city}` - Get current weather by city name
- `GET /api/forecast/coords?lat={lat}&lon={lon}` - Get 5-day forecast by coordinates
- `GET /api/forecast/city?city={city}` - Get 5-day forecast by city name

### Favorites Endpoints

- `GET /api/favorites` - Get all favorite locations
- `POST /api/favorites` - Add location to favorites
- `DELETE /api/favorites/{id}` - Remove location from favorites

## 📁 Project Structure

```
weather-app/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection and session
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── weather_service.py   # Weather API service
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Environment variables (not in git)
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── App.css          # Application styles
│   │   ├── main.jsx         # React entry point
│   │   ├── translations.js  # Multi-language support
│   │   └── index.css        # Global styles
│   ├── public/              # Static assets
│   ├── package.json         # Node dependencies
│   ├── vite.config.js       # Vite configuration
│   └── .gitignore
│
└── README.md
```

## 🌐 Environment Variables

### Backend (.env)

```env
OPENWEATHER_API_KEY=your_openweathermap_api_key
DATABASE_URL=sqlite:///./weather.db
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Frontend (.env) - Optional

```env
VITE_API_URL=http://localhost:8000
```

## 🎨 Features in Detail

### Current Weather Display
- Temperature (Celsius)
- Feels like temperature
- Weather description with icon
- Humidity percentage
- Wind speed
- Atmospheric pressure
- Cloudiness
- Min/Max temperatures

### Forecast
- **Hourly Forecast**: Next 24 hours with 3-hour intervals
- **Daily Forecast**: 5-day forecast with expandable details
- Temperature trends
- Weather conditions for each period

### Geolocation
- Automatic location detection using browser's Geolocation API
- One-click weather for current location

### Favorites
- Save unlimited favorite locations
- Quick access to saved cities
- Persistent storage in SQLite database

### Multi-language Support
- English (EN)
- Russian (RU)
- Spanish (ES)
- French (FR)
- Language preference saved in localStorage

## 🔧 Development

### Backend Development

```bash
# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run tests (if implemented)
pytest
```

### Frontend Development

```bash
# Development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📦 Building for Production

### Backend

```bash
# Install production dependencies
pip install -r requirements.txt

# Run with production server
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
# Build optimized production bundle
npm run build

# Output will be in dist/ directory
```

## 🐛 Troubleshooting

### Backend Issues

**Issue**: `ModuleNotFoundError`
- Solution: Make sure virtual environment is activated and dependencies are installed

**Issue**: `API key error`
- Solution: Check that your OpenWeatherMap API key is valid and added to `.env`

**Issue**: `Database error`
- Solution: Delete `weather.db` file and restart the server to recreate database

### Frontend Issues

**Issue**: `CORS error`
- Solution: Check that backend CORS settings include your frontend URL

**Issue**: `API connection failed`
- Solution: Verify backend is running and `VITE_API_URL` is correct

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons and design inspiration from modern weather apps
- Built with ❤️ using FastAPI and React

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

**Note**: This application uses the free tier of OpenWeatherMap API, which has rate limits. For production use, consider upgrading to a paid plan.
