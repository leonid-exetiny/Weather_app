import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import './App.css'
import { translations, languages } from './translations'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const POPULAR_CITIES = [
  { name: 'London', country: 'GB', icon: '🇬🇧' },
  { name: 'New York', country: 'US', icon: '🇺🇸' },
  { name: 'Tokyo', country: 'JP', icon: '🇯🇵' },
  { name: 'Paris', country: 'FR', icon: '🇫🇷' },
  { name: 'Dubai', country: 'AE', icon: '🇦🇪' },
  { name: 'Singapore', country: 'SG', icon: '🇸🇬' },
  { name: 'Sydney', country: 'AU', icon: '🇦🇺' },
  { name: 'Moscow', country: 'RU', icon: '🇷🇺' },
]

function App() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [searchCity, setSearchCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showHero, setShowHero] = useState(true)
  const [expandedDay, setExpandedDay] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en'
  })
  const [showLangMenu, setShowLangMenu] = useState(false)

  const t = translations[language]

  const translate = (text) => {
    if (!text) return text
    const lowerText = text.toLowerCase()
    // Try exact match first, then lowercase match
    return t[text] || t[lowerText] || text
  }

  useEffect(() => {
    loadFavorites()
  }, [])

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      setShowHero(false)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          fetchWeatherByCoords(latitude, longitude)
          fetchForecastByCoords(latitude, longitude)
        },
        (error) => {
          setError(t.errorLocation)
          setLoading(false)
          setShowHero(true)
        }
      )
    } else {
      setError(t.errorGeo)
    }
  }

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`${API_URL}/api/weather/coords`, {
        params: { lat, lon }
      })
      setWeather(response.data)
      setShowHero(false)
    } catch (err) {
      setError(err.response?.data?.detail || t.errorFetch)
      setShowHero(true)
    } finally {
      setLoading(false)
    }
  }

  const fetchForecastByCoords = async (lat, lon) => {
    try {
      const response = await axios.get(`${API_URL}/api/forecast/coords`, {
        params: { lat, lon }
      })
      setForecast(response.data)
    } catch (err) {
      console.error('Failed to fetch forecast data', err)
    }
  }

  const fetchWeatherByCity = async (city) => {
    try {
      setLoading(true)
      setError(null)
      setShowHero(false)
      const response = await axios.get(`${API_URL}/api/weather/city`, {
        params: { city }
      })
      setWeather(response.data)
      fetchForecastByCity(city)
    } catch (err) {
      setError(err.response?.data?.detail || t.cityNotFound)
      setShowHero(true)
    } finally {
      setLoading(false)
    }
  }

  const fetchForecastByCity = async (city) => {
    try {
      const response = await axios.get(`${API_URL}/api/forecast/city`, {
        params: { city }
      })
      setForecast(response.data)
    } catch (err) {
      console.error('Failed to fetch forecast data', err)
    }
  }

  const loadFavorites = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/favorites`)
      setFavorites(response.data)
    } catch (err) {
      console.error('Failed to load favorites', err)
    }
  }

  const addToFavorites = async () => {
    if (!weather) return

    try {
      await axios.post(`${API_URL}/api/favorites`, {
        city_name: weather.city_name,
        country: weather.country,
        lat: 0,
        lon: 0
      })
      loadFavorites()
    } catch (err) {
      if (err.response?.status === 400) {
        alert(t.alreadyFavorite)
      } else {
        alert('Failed to add to favorites')
      }
    }
  }

  const removeFavorite = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/favorites/${id}`)
      loadFavorites()
    } catch (err) {
      alert('Failed to remove from favorites')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchCity.trim()) {
      fetchWeatherByCity(searchCity)
      setSearchCity('')
    }
  }

  const handleCityClick = (cityName) => {
    fetchWeatherByCity(cityName)
  }

  const getWeatherIcon = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}@4x.png`
  }

  const getCountryFlag = (countryCode) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt())
    return String.fromCodePoint(...codePoints)
  }

  const getLocale = () => {
    const localeMap = {
      'en': 'en-US',
      'ru': 'ru-RU',
      'es': 'es-ES',
      'fr': 'fr-FR'
    }
    return localeMap[language] || 'en-US'
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString(getLocale(), {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString(getLocale(), {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDailyForecast = () => {
    if (!forecast) return []

    const daily = {}
    forecast.forecast.forEach(item => {
      const date = item.dt_txt.split(' ')[0]
      if (!daily[date]) {
        daily[date] = {
          ...item,
          items: []
        }
      }
      daily[date].items.push(item)
    })

    return Object.values(daily).slice(0, 5)
  }

  const getHourlyForecast = () => {
    if (!forecast) return []
    return forecast.forecast.slice(0, 8)
  }

  return (
    <div className="app">
      <div className="container">
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-content">
            <div className="logo">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
              </svg>
              <h1>Weather</h1>
            </div>
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
              </div>
              <button type="button" onClick={getUserLocation} className="location-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </button>
              <div className="language-selector">
                <button
                  type="button"
                  className="lang-btn"
                  onClick={() => setShowLangMenu(!showLangMenu)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </button>
                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div
                      className="lang-menu"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          className={`lang-option ${language === lang.code ? 'active' : ''}`}
                          onClick={() => {
                            setLanguage(lang.code)
                            setShowLangMenu(false)
                          }}
                        >
                          <span className="lang-flag">{lang.flag}</span>
                          <span className="lang-name">{lang.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {showHero && !weather && !loading && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="hero-section"
            >
              <div className="hero-content">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {t.heroTitle}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {t.heroSubtitle}
                </motion.p>
                <motion.button
                  className="cta-button"
                  onClick={getUserLocation}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {t.useLocation}
                </motion.button>
              </div>

              <motion.div
                className="popular-cities"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3>{t.popularCities}</h3>
                <div className="cities-grid">
                  {POPULAR_CITIES.map((city, index) => (
                    <motion.button
                      key={city.name}
                      className="city-card"
                      onClick={() => handleCityClick(city.name)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="city-icon">{city.icon}</span>
                      <span className="city-name">{translate(city.name)}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="features-grid"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="feature-card">
                  <div className="feature-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v10m0 0L8 8m4 4 4-4"/>
                      <path d="M12 12v10m0 0-4-4m4 4 4-4"/>
                    </svg>
                  </div>
                  <h3>{t.realTimeTitle}</h3>
                  <p>{t.realTimeDesc}</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <h3>{t.forecastTitle}</h3>
                  <p>{t.forecastDesc}</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <h3>{t.locationsTitle}</h3>
                  <p>{t.locationsDesc}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </motion.div>
        )}

        {loading && (
          <motion.div
            className="loading-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="spinner"></div>
            <p>{t.loading}</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {weather && !loading && (
            <motion.div
              key="weather"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="weather-content"
            >
              <div className="main-weather-card">
                <div className="weather-header">
                  <div className="location-info">
                    <motion.button
                      className="back-btn"
                      onClick={() => {
                        setWeather(null)
                        setForecast(null)
                        setShowHero(true)
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="19" y1="12" x2="5" y2="12"/>
                        <polyline points="12 19 5 12 12 5"/>
                      </svg>
                      {t.backToHome}
                    </motion.button>
                    <h2>
                      <span className="country-flag">{getCountryFlag(weather.country)}</span>
                      {weather.city_name}, {weather.country}
                    </h2>
                    <p>{new Date().toLocaleDateString(getLocale(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="header-actions">
                    <motion.button
                      className="details-btn"
                      onClick={() => setShowDetails(!showDetails)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="12" cy="5" r="1"/>
                        <circle cx="12" cy="19" r="1"/>
                      </svg>
                      {t.details}
                    </motion.button>
                    <motion.button
                      className="save-btn"
                      onClick={addToFavorites}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                      {t.save}
                    </motion.button>
                  </div>
                </div>

                <div className="current-weather">
                  <div className="weather-visual">
                    <motion.img
                      src={getWeatherIcon(weather.icon)}
                      alt={weather.description}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                    <div className="temp-display">
                      <motion.span
                        className="temperature"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                      >
                        {Math.round(weather.temp)}°
                      </motion.span>
                      <span className="temp-unit">C</span>
                    </div>
                  </div>
                  <div className="weather-description">
                    <h3>{translate(weather.description)}</h3>
                    <p>{t.feelsLike} {Math.round(weather.feels_like)}°C</p>
                  </div>
                </div>

                <div className="weather-stats">
                  <div className="stat-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                    </svg>
                    <div className="stat-info">
                      <span className="stat-label">{t.humidity}</span>
                      <span className="stat-value">{weather.humidity}%</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
                    </svg>
                    <div className="stat-info">
                      <span className="stat-label">{t.windSpeed}</span>
                      <span className="stat-value">{weather.wind_speed} m/s</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M2 12h20"/>
                    </svg>
                    <div className="stat-info">
                      <span className="stat-label">{t.pressure}</span>
                      <span className="stat-value">{weather.pressure} hPa</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                    <div className="stat-info">
                      <span className="stat-label">{t.cloudiness}</span>
                      <span className="stat-value">{weather.clouds}%</span>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      className="detailed-stats"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="stats-grid">
                        <div className="detail-stat">
                          <span className="detail-label">{t.minTemp}</span>
                          <span className="detail-value">{Math.round(weather.temp_min)}°C</span>
                        </div>
                        <div className="detail-stat">
                          <span className="detail-label">{t.maxTemp}</span>
                          <span className="detail-value">{Math.round(weather.temp_max)}°C</span>
                        </div>
                        <div className="detail-stat">
                          <span className="detail-label">{t.visibility}</span>
                          <span className="detail-value">{t.good}</span>
                        </div>
                        <div className="detail-stat">
                          <span className="detail-label">{t.uvIndex}</span>
                          <span className="detail-value">{t.moderate}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {forecast && (
                <>
                  <motion.div
                    className="hourly-forecast"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3>{t.hourlyForecast}</h3>
                    <div className="hourly-scroll">
                      {getHourlyForecast().map((item, index) => (
                        <motion.div
                          key={index}
                          className="hourly-item"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                        >
                          <span className="hour-time">{formatTime(item.dt)}</span>
                          <img src={getWeatherIcon(item.icon)} alt={item.description} />
                          <span className="hour-temp">{Math.round(item.temp)}°</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    className="daily-forecast"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3>{t.dailyForecast}</h3>
                    <div className="daily-grid">
                      {getDailyForecast().map((day, index) => (
                        <motion.div
                          key={index}
                          className={`daily-card ${expandedDay === index ? 'expanded' : ''}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                        >
                          <div className="daily-main">
                            <span className="day-name">{formatDate(day.dt)}</span>
                            <img src={getWeatherIcon(day.icon)} alt={translate(day.description)} />
                            <div className="day-temp">
                              <span className="temp-high">{Math.round(day.temp_max)}°</span>
                              <span className="temp-low">{Math.round(day.temp_min)}°</span>
                            </div>
                            <span className="day-desc">{translate(day.description)}</span>
                          </div>

                          <AnimatePresence>
                            {expandedDay === index && (
                              <motion.div
                                className="daily-details"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="detail-row">
                                  <span>{t.humidity}:</span>
                                  <span>{day.humidity}%</span>
                                </div>
                                <div className="detail-row">
                                  <span>{t.wind}:</span>
                                  <span>{day.wind_speed} m/s</span>
                                </div>
                                <div className="detail-row">
                                  <span>{t.pressure}:</span>
                                  <span>{day.pressure} hPa</span>
                                </div>
                                <div className="detail-row">
                                  <span>{t.clouds}:</span>
                                  <span>{day.clouds}%</span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {favorites.length > 0 && (
          <motion.div
            className="favorites-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3>{t.savedLocations}</h3>
            <div className="favorites-grid">
              {favorites.map((fav, index) => (
                <motion.div
                  key={fav.id}
                  className="favorite-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => fetchWeatherByCity(fav.city_name)}
                >
                  <div className="favorite-info">
                    <span className="favorite-flag">{getCountryFlag(fav.country)}</span>
                    <span>{fav.city_name}, {fav.country}</span>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFavorite(fav.id)
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default App
