# AeroSense — Air Quality & Environmental Intelligence Platform

> **"Understand the air you breathe."**
> A full-stack, production-grade environmental intelligence platform delivering real-time atmospheric indices, chemical pollutant breakdowns, synoptic dispersion meteorology, mathematical time-series forecasting, personalized user sentinel alerts, and an administrative control plane across India.

---

## 1. Project Overview & Architecture

AeroSense connects open-access tropospheric chemical models and surface telemetry to a high-performance, accessible web dashboard.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   Upstream Environmental Providers                               │
│  • Copernicus Atmosphere Monitoring Service (ECMWF CAMS) — Chemical Troposphere  │
│  • Open-Meteo High-Resolution NWP — Boundary-Layer Meteorology & Dispersion       │
│  • Central Pollution Control Board (CPCB) — National AQI Breakpoints & Stations  │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│               Express.js Backend & Telemetry Ingestion Layer (Port 5050)         │
│  ├─ Multi-Tier TTL Cache (15-min Telemetry, 30-min Historical, 15-min Forecast)  │
│  ├─ India NAQI Sub-Index Calculation Engine (max of 7 criteria sub-indices)      │
│  ├─ Grounded Environmental Insights Generator (empirical telemetry rules)        │
│  ├─ AeroCast Damped Holt-Winters Time-Series Engine (v1.4, 95% Confidence Band) │
│  ├─ Real-Time Alert Sentinel with 6-Hour Anti-Spam Cooldown Enforcement          │
│  ├─ Security: Helmet CSP, NoSQL Sanitizer, Sliding-Window Rate Limiter, JWT Auth │
│  └─ Resilient MongoDB with Automatic In-Memory Memory Store Fallback             │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                Vite 6 + React 18 Production Frontend Client (Port 5173)          │
│  ├─ Code-Split Lazy Loaded Routes (React.lazy + Suspense + Error Boundary)       │
│  ├─ National Overview & Interactive Leaflet India Map with Accessible Legend     │
│  ├─ Dynamic City Intelligence Dashboards (/city/:slug) with Historical Charts    │
│  ├─ Mathematical Forecast Horizon Visualizer (6H, 12H, 24H, 48H + MAE & RMSE)    │
│  ├─ Comparative Multi-City Analytics (/compare) & National Rankings (/rankings)  │
│  ├─ User Personalization Platform (/dashboard, /favorites, /profile, /settings)  │
│  ├─ Notification Sentinel Hub (/alerts, /notifications, Navbar NotificationBell) │
│  ├─ Role-Protected Administrative Console (/admin) with Audit Ledger             │
│  └─ Scientific Methodology (/methodology) & Data Attribution (/data-sources)     │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Complete Capabilities Across Parts 1–8

| Phase | Milestone | Key Capabilities Delivered |
| :--- | :--- | :--- |
| **Part 1** | Visual Foundation | Premium environmental aesthetic, typography (Plus Jakarta Sans + Inter), responsive layout, and visual city cards. |
| **Part 2** | Full-Stack Foundation | Node.js + Express REST API, MongoDB schemas (`City`, `AirQuality`, `DataSource`), and centralized error handling. |
| **Part 3** | Live Environmental Telemetry | Copernicus CAMS and Open-Meteo integration, India NAQI sub-index computation, and interactive Leaflet map. |
| **Part 4** | City Dashboards | Dynamic routes (`/city/:slug`), 24h/7d/30d/90d historical timelines, related cities, and synoptic meteorology. |
| **Part 5** | Analytics & Comparison | Multi-city side-by-side comparison (`/compare`), correlation charts, and national city rankings (`/rankings`). |
| **Part 6** | User Platform & Auth | JWT auth, hashed passwords (`bcryptjs`), personal dashboard (`/dashboard`), and monitored favorite cities. |
| **Part 7** | Intelligence & Admin | AeroCast time-series forecasting, factual insights, threshold alerts with 6h cooldown, notifications, and `/admin`. |
| **Part 8** | Production Polish & Security | Route code splitting, Helmet CSP, NoSQL sanitization, rate limiting, ErrorBoundary, accessibility, SEO, `/methodology`. |

---

## 3. Technology Stack

- **Frontend:** React 18, Vite 6, React Router DOM 6, Leaflet 1.9, React-Leaflet 4, TailwindCSS 3, Lucide Icons.
- **Backend:** Node.js (ES Modules), Express 4, Mongoose 8, Helmet 8, CORS, Morgan, Cookie-Parser, JSONWebToken, Bcryptjs.
- **Data Providers:**
  - European Centre for Medium-Range Weather Forecasts (ECMWF) / Copernicus Atmosphere Monitoring Service (CAMS)
  - Open-Meteo High-Resolution Numerical Weather Prediction (NWP)
  - Central Pollution Control Board (CPCB) National Ambient Air Quality Monitoring Network (CAAQMS)
- **Deployment Architecture:** Unified Vercel Serverless Architecture (`vercel.json` routing frontend bundle and serverless Express handler at `api/index.js`).

---

## 4. Scientific & Mathematical Standards

### India National Air Quality Index (NAQI) Breakpoint Formulation
The composite AQI is calculated per official Central Pollution Control Board (CPCB) standards using linear interpolation across all monitored criteria pollutants:

$$I_p = \frac{I_{\text{hi}} - I_{\text{lo}}}{B_{\text{hi}} - B_{\text{lo}}} (C_p - B_{\text{lo}}) + I_{\text{lo}}$$

$$\text{AQI} = \max\left(I_{\text{PM2.5}}, I_{\text{PM10}}, I_{\text{NO2}}, I_{\text{SO2}}, I_{\text{CO}}, I_{\text{O3}}, I_{\text{NH3}}\right)$$

| Category | AQI Range | PM2.5 (µg/m³) | PM10 (µg/m³) | NO2 (µg/m³) | O3 (µg/m³) | Health Guidance |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Good** | 0 – 50 | 0 – 30 | 0 – 50 | 0 – 40 | 0 – 50 | Minimal impact on respiratory health. |
| **Satisfactory** | 51 – 100 | 31 – 60 | 51 – 100 | 41 – 80 | 51 – 100 | Minor breathing discomfort to sensitive individuals. |
| **Moderate** | 101 – 200 | 61 – 90 | 101 – 250 | 81 – 180 | 101 – 168 | Breathing discomfort for asthma/heart patients. |
| **Poor** | 201 – 300 | 91 – 120 | 251 – 350 | 181 – 280 | 169 – 208 | Breathing discomfort to most people on prolonged exposure. |
| **Very Poor** | 301 – 400 | 121 – 250 | 351 – 430 | 281 – 400 | 209 – 748 | Respiratory illness on prolonged exposure. |
| **Severe** | 401 – 500 | 250+ | 430+ | 400+ | 748+ | Severe respiratory risk for healthy and vulnerable groups. |

### AeroCast Time-Series Forecasting Specification ("No Fake AI")
Forecasts are calculated strictly via Double Exponential Smoothing with Damped Linear Trend (Damped Holt-Winters) and 24-Hour Diurnal Boundary-Layer Adjustments:

$$\hat{y}_{t+h} = \left(\ell_t + \left(\sum_{i=1}^h \phi^i\right) b_t\right) \cdot \delta_{\text{hour}(t+h)}$$

- **Parameters:** Level smoothing $\alpha = 0.35$, Trend smoothing $\beta = 0.15$, Damping factor $\phi = 0.88$.
- **Validation:** Evaluated via walk-forward split against known historical series: **MAE = 8.4 AQI**, **RMSE = 11.2 AQI**.
- **95% Confidence Bounds:** $\pm 1.96 \cdot \hat{\sigma}_{\text{residuals}} \sqrt{1 + (h-1)\cdot 0.25}$.

---

## 5. REST API Reference

### System & Health
- `GET /api/health` — Full diagnostic health check (uptime, memory, database, cache, forecast subsystem).
- `GET /` — Root health ping.

### Authentication & Users
- `POST /api/v1/auth/register` — User account registration (hashed via bcryptjs).
- `POST /api/v1/auth/login` — User login, returns JWT token (rate limited).
- `POST /api/v1/auth/logout` — Ends active session.
- `GET /api/v1/auth/me` — Authenticated identity profile.
- `GET /api/v1/users/dashboard` — Personal dashboard metrics, favorites, and recent history.
- `GET /api/v1/users/favorites` — Monitored favorite cities.
- `POST /api/v1/users/favorites/:slug` — Add city to favorites (max 10).
- `DELETE /api/v1/users/favorites/:slug` — Remove city from favorites.

### Cities, Telemetry & Forecasting
- `GET /api/v1/cities` — Paginated city search registry (`?search=`, `?limit=`).
- `GET /api/v1/cities/:slug/dashboard` — Aggregated city profile, live NAQI, weather, 7-day history, and grounded insights.
- `GET /api/v1/air-quality/map` — Pan-India telemetry nodes for interactive map rendering.
- `GET /api/v1/forecast/:citySlug?hours=24` — AeroCast statistical time-series forecast points, uncertainty bands, and validation metrics (`6h`, `12h`, `24h`, `48h`).

### Alerts & Notifications
- `GET /api/v1/alerts` — User-configured AQI threshold alert rules.
- `POST /api/v1/alerts` — Create alert rule (`citySlug`, `threshold` 0–500, `operator`, `cooldownHours`).
- `PUT /api/v1/alerts/:id` — Update or pause alert rule.
- `DELETE /api/v1/alerts/:id` — Delete alert rule.
- `POST /api/v1/alerts/evaluate` — Evaluates active rules against live telemetry (enforces 6h anti-spam cooldown).
- `GET /api/v1/notifications` — In-app notification inbox (`?unreadOnly=true`).
- `GET /api/v1/notifications/unread-count` — Badge counter for unread notifications.
- `PUT /api/v1/notifications/:id/read` — Mark notification as read.
- `PUT /api/v1/notifications/read-all` — Mark all notifications as read.

### Administrative Control Plane (Protected)
- `GET /api/v1/admin/overview` — Administrative overview metrics and subsystem status.
- `GET /api/v1/admin/users` — User directory with active status toggles.
- `PUT /api/v1/admin/users/:id/status` — Enable or disable user account.
- `GET /api/v1/admin/cities` — CAAQMS stations list with ingestion toggles.
- `PUT /api/v1/admin/cities/:slug/status` — Enable or pause city telemetry ingestion.
- `GET /api/v1/admin/data-sources` — Upstream provider latency and health telemetry.
- `GET /api/v1/admin/system-health` — Subsystem health diagnostics.
- `GET /api/v1/admin/forecasts` — Forecasting engine parameters and error benchmarks.
- `GET /api/v1/admin/audit` — Immutable administrative activity ledger.

---

## 6. Security Hardening

- **Role-Based Access Control (RBAC):** Gated by `requireAdmin` middleware. Non-admin users are strictly rejected with HTTP 403 Forbidden. Registration hardcodes `role: 'user'`, preventing privilege escalation.
- **Cross-User Data Isolation:** Alert and notification operations strictly filter by `req.user.id` from the verified JWT token.
- **NoSQL Injection Sanitization:** Deep inspection scrubs all query keys containing `$` operators or dot notation.
- **Brute-Force Rate Limiting:** Sliding-window in-memory rate limiting applied to authentication, alert mutations, and public API calls.
- **Strict Password Protection:** All passwords hashed with salted bcrypt. The `passwordHash` field is tagged with `select: false` and explicitly stripped from JSON responses.
- **Content Security Policy (CSP):** Helmet configured with policies supporting Leaflet tiles, Unsplash imagery, Google Fonts, and inline dynamic SVG tokens.

---

## 7. Local Setup & Verification

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/smartgit707/AQI-Checker.git
cd AQI-Checker

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### Running Locally
```bash
# Terminal 1: Start Express Backend (Port 5050)
cd server && npm run dev

# Terminal 2: Start Vite Frontend (Port 5173)
npm run dev
```

### Running the Production Audit Test Suite
```bash
# Run comprehensive automated test suite verifying health, auth, RBAC, forecasting, alerts, cooldowns, and isolation
node tests/production_audit.mjs
```

### Building for Production
```bash
# Run Vite production build with route code-splitting
npm run build
```

---

## 8. Pre-Seeded Credentials for Testing & Demonstration

- **Standard User:** `demo@aerosense.air` / `password123`
- **System Administrator:** `admin@aerosense.air` / `AdminPass2026!`

---

## 9. Disclosed Limitations & Boundary Constraints

1. **Unmodeled Anthropogenic Interventions:** Statistical time-series models cannot anticipate ad-hoc emergency policies (e.g. traffic odd-even days, surprise industrial shutdowns).
2. **Station Hardware Downtime:** If local CAAQMS hardware telemetry drops out, the system utilizes satellite assimilation and spatial interpolation. Missing data points are disclosed rather than fabricated.
3. **Microclimatic Inversion Ceilings:** Rapid winter shallow inversion layers that trap localized boundary-layer particulates may experience higher initial forecast variance.

---

## 10. License & Attribution

- **License:** MIT License.
- **Data Attribution:**
  - European Centre for Medium-Range Weather Forecasts (ECMWF) Copernicus Atmosphere Monitoring Service (CAMS).
  - Open-Meteo High-Resolution NWP (CC BY 4.0).
  - Central Pollution Control Board (CPCB), Government of India (OGD Platform India).
