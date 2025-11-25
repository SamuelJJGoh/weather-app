# Weather Web App

Simple full-stack weather dashboard with an Express backend proxying OpenWeather and a static frontend. Search by city to see current conditions, toggle °C/°F, view a 5‑day forecast, and save/remove favourite cities (persisted in `localStorage`).

## Quick start
1) Install deps:
```bash
npm install
```
2) Create `.env` in the project root with your OpenWeather API key:
```
API_KEY=your_openweather_api_key
```
3) Run the server (defaults to port 3000):
```bash
npm run dev   # nodemon for dev
# or
npm start
```
4) Open `public/index.html` in a browser (or serve the `public` folder via any static server) and point the UI at `http://localhost:3000` (already baked into `public/index.js`).

## Features
- Current weather by city (backend proxies OpenWeather, hiding the API key from the client).
- °C/°F toggle updates current + forecast temps.
- 5‑day forecast at midday intervals, shown to the right of the main card.
- Save/remove favourite cities; favourites persist in `localStorage` and render as quick-launch chips.
- Basic error handling for missing/invalid cities.

## Project structure
- `server.js` — Express app wiring CORS + routes.
- `routes/weather.js` — `/weather?city=...` proxy to OpenWeather current conditions.
- `routes/forecast.js` — `/forecast?city=...` proxy to 5‑day forecast.
- `public/` — Frontend (HTML, CSS, JS, icons, background).

## Notes
- The backend listens on port 3000; change `BACKEND_URL` in `public/index.js` if you run on a different host/port.
- No build step; everything runs directly with Node + static assets.
