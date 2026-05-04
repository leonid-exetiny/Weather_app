# Weather App Frontend

Modern React frontend for the Weather App with beautiful UI and smooth animations.

## Features

- Real-time weather display
- 5-day weather forecast
- Hourly forecast
- Geolocation support
- City search
- Favorite locations
- Multi-language support (EN, RU, ES, FR)
- Responsive design
- Smooth animations with Framer Motion

## Tech Stack

- React 19
- Vite
- Axios
- Framer Motion
- CSS3

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Environment Variables

Create a `.env` file (optional):

```env
VITE_API_URL=http://localhost:8000
```

If not set, defaults to `http://localhost:8000`.

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx          # Main component
│   ├── App.css          # Styles
│   ├── main.jsx         # Entry point
│   ├── translations.js  # i18n translations
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.js       # Vite config
└── package.json         # Dependencies
```

## Supported Languages

- English (EN)
- Russian (RU)
- Spanish (ES)
- French (FR)

Language preference is saved in browser's localStorage.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Requires browser with Geolocation API support for location features.
