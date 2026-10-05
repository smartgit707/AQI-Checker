# AeroSense — Air Quality & Environmental Intelligence Platform

> **"Understand the air you breathe."**
> A production-quality environmental intelligence platform providing real-time air quality metrics, particulate breakdowns, synoptic dispersion telemetry, historical timelines, and dedicated city intelligence dashboards across India.

---

## 1. Project Overview & Architecture

AeroSense connects real atmospheric models and surface telemetry to a full-stack dashboard:

```
[ Copernicus CAMS Global Atmospheric Model & Open-Meteo Weather Services ]
                                │ (Public ECMWF & WMO Data)
                                ▼
               [ Provider Adapters & Normalization ]
         ├─ airQualityProvider.js (CPCB NAQI Sub-Index Calculation & Past Days)
         ├─ weatherProvider.js (WMO Conditions, Wind Direction Vectors)
         ├─ trendCalculator.js (Historical Window Baseline Trend Computation)
         └─ In-Memory TTL Cache (15-min Telemetry Expiry, 30-min Historical)
                                │
                                ▼
              [ Express.js REST API Layer ] (Port 5050)
         ├─ /api/v1/cities/:slug/dashboard (Aggregated City Intelligence)
         ├─ /api/v1/air-quality/:cityId/latest
         ├─ /api/v1/air-quality/:cityId/history?period=7d (24h, 7d, 30d, 90d)
         ├─ /api/v1/air-quality/map (Pan-India Geospatial Nodes)
         ├─ /api/v1/cities (Search & Pagination)
         └─ /api/v1/data-sources
                                │
                                ▼
         [ MongoDB Database with Auto In-Memory Fallback ]
                                │
                                ▼
             [ React 18 + Vite Frontend ] (Port 5173)
         ├─ Dynamic City Pages (/city/:slug) with Breadcrumbs & Dynamic Meta
         ├─ CityHero with Regulatory CAAQMS Station Badges & Image Backdrop
         ├─ HistoricalAQISection (Period Switching, Pollutant Filters & Trends)
         ├─ CityProfileSection (Coordinates, Population, Station Hardware)
         ├─ Interactive Leaflet India Map (OpenStreetMap Tiles & Proximity Centering)
         ├─ Real-Time NAQI Radial Gauge & Diurnal Progression
         ├─ Chemical Pollutant Matrix (PM2.5, PM10, NO2, SO2, CO, O3)
         └─ Synoptic Dispersion & Health Guidance Modules
```

---

## 2. Tech Stack

- **Frontend:** React 18, Vite 6, React Router DOM 6, Leaflet 1.9, React-Leaflet 4, TailwindCSS 3, Lucide Icons, Plus Jakarta Sans & Inter typography
- **Backend:** Node.js, Express 4, Mongoose 8, Helmet, CORS, Morgan, dotenv
- **Environmental Providers:**
  - European Centre for Medium-Range Weather Forecasts (ECMWF) / Copernicus Atmosphere Monitoring Service (CAMS) via Open-Meteo
  - World Meteorological Organization (WMO) Global Forecast System
- **AQI Calculation Standard:** Indian National Air Quality Index (NAQI) Breakpoint Formula (CPCB / MoEFCC 2015/2026 Revision)

---

## 3. City Intelligence System (Part 4)

### Dynamic City Routes
- Reusable dynamic route `/city/:slug` powered by React Router.
- Examples:
  - `/city/delhi`
  - `/city/mumbai`
  - `/city/chennai`
  - `/city/bengaluru`
  - `/city/hyderabad`
  - `/city/kolkata`
  - `/city/pune`
  - `/city/shimla`
  - `/city/chandigarh`
  - `/city/jaipur`
  - `/city/lucknow`
  - `/city/ahmedabad`
  - `/city/kochi`
  - `/city/patna`
  - `/city/bhopal`
  - `/city/guwahati`

### City Dashboard Aggregated API
- `GET /api/v1/cities/:slug/dashboard`
  - Executes concurrent retrieval for city profile, real-time NAQI, surface weather, 7-day historical timeline, and 4 geographically/regionally related stations in a single performant payload.

### Real Historical Data & Trend Calculation
- Uses Open-Meteo CAMS `past_days` parameter to retrieve authentic historical hourly particulate concentrations for **24 Hours**, **7 Days**, **30 Days**, and **90 Days**.
- **Trend Methodology (`server/src/utils/trendCalculator.js`):**
  - Divides historical points into recent half ($B$) and earlier half ($A$).
  - Evaluates percentage shift: $\frac{\text{Avg}_B - \text{Avg}_A}{\text{Avg}_A} \times 100$.
  - Classified factually:
    - $\le -5\%$: **Improving** (air is becoming cleaner)
    - $\ge +5\%$: **Worsening** (pollution is escalating)
    - Between $-5\%$ and $+5\%$: **Relatively Stable**

---

## 4. REST API Endpoints

### System Diagnostics
- `GET /api/health` — Service status, environment, uptime, and database connection state.

### City Intelligence & Profiles
- `GET /api/v1/cities/:slug/dashboard` — Aggregated environmental intelligence profile for a city.
- `GET /api/v1/cities` — Paginated list of monitored cities (`?search=`, `?state=`, `?page=`, `?limit=`).
- `GET /api/v1/cities/:slug` — City metadata and station specs.

### Air Quality & Weather Telemetry
- `GET /api/v1/air-quality/:cityId/latest` — Real-time NAQI, chemical pollutants, weather assimilation, and source attribution.
- `GET /api/v1/air-quality/map` — Batch geospatial nodes across India for rendering interactive map markers.
- `GET /api/v1/air-quality/:cityId/history?period=7d` — Historical diurnal trend points (`24h`, `7d`, `30d`, `90d`).
- `GET /api/v1/air-quality` — Latest snapshot listing.

### Data Transparency
- `GET /api/v1/data-sources` — Reference catalog of regulatory bodies and measurement standards (CPCB, SPCBs, ECMWF CAMS, IMD).

---

## 5. Getting Started & Running the Project

### Running the Frontend
```bash
npm run dev
# Running on http://127.0.0.1:5173
```

### Running the Backend
```bash
npm run server

# Or directly in the server directory:
cd server
npm run dev
# Running on http://127.0.0.1:5050
```

### Seeding Development Data
```bash
npm run server:seed
```

---

## 6. Environment Variables

### Backend (`server/.env`):
```env
PORT=5050
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/aerosense
CLIENT_URL=http://localhost:5173
```

### Frontend (`.env`):
```env
VITE_API_BASE_URL=http://localhost:5050/api/v1
```

---

## 7. Current Development Status

- [x] **Part 1:** Premium Visual Foundation & Image-Rich Homepage (Completed)
- [x] **Part 2:** Backend Foundation & Full-Stack Architecture (Completed)
- [x] **Part 3:** Real AQI & Environmental Data Integration + Interactive India Map (Completed)
- [x] **Part 4:** City Intelligence & Dedicated City Environmental Dashboards (Completed)
- [ ] **Part 5:** Historical Comparisons & Multi-City Analytics (Next)
- [ ] **Part 6:** User Accounts & Personalization
- [ ] **Part 7:** ML Forecasting, Push Alerts & Admin Dashboard
- [ ] **Part 8:** Production Hardening & CDN Optimization
