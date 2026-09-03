# FxFlow

**Real-time currency conversion and FX insights.**

FxFlow is a full-stack fintech web application that provides real-time currency conversion, 30-day historical exchange-rate visualization, favorite currency pairs, conversion history, and multi-currency travel budgeting.

---

## Features

- Real-time currency conversion via ExchangeRate API
- 30-day historical exchange-rate line chart (Recharts)
- Favorite currency pairs with click-to-load
- Conversion history persistence
- Travel Budgeting mode (compare across 5 major currencies)
- Server-side caching (SQLite) to minimize API calls
- Backend validation and error handling
- Responsive, dark fintech-style UI (shadcn/ui + Aceternity-inspired)
- Loading, error, and empty states

---

## Tech Stack

### Frontend

- React.js (Vite)
- JavaScript (no TypeScript)
- Tailwind CSS
- shadcn/ui components
- Recharts (charting)
- TanStack Query (server state)
- Lucide React (icons)

### Backend

- Python 3.10+
- FastAPI
- Pydantic (validation)
- SQLAlchemy (ORM)
- httpx (async HTTP)
- SQLite

---

## Architecture

```
React Frontend
    ↓
TanStack Query
    ↓
REST API
    ↓
FastAPI Backend
    ↓
┌────────────┬────────────┬────────────┐
│ Conversion │ Historical │ Favorites  │
│  Service   │  Service   │  Service   │
└────────────┴────────────┴────────────┘
    ↓
Data Access Layer
    ↓
┌──────────┬───────────────────┐
│  SQLite  │ ExchangeRate API  │
└──────────┴───────────────────┘
```

Backend follows a layered architecture:

```
API Routes → Service Layer → Data / External API Layer → SQLite / ExchangeRate API
```

---

## Project Structure

```
FxFlow/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── conversion.py
│   │   │   ├── rates.py
│   │   │   ├── favorites.py
│   │   │   ├── history.py
│   │   │   ├── travel.py
│   │   │   └── currencies.py
│   │   ├── services/
│   │   │   ├── exchange_rate.py
│   │   │   ├── conversion.py
│   │   │   ├── historical.py
│   │   │   ├── favorites.py
│   │   │   └── travel_budget.py
│   │   ├── models/
│   │   │   ├── favorite.py
│   │   │   ├── conversion_history.py
│   │   │   └── rate_cache.py
│   │   ├── schemas/
│   │   │   ├── conversion.py
│   │   │   ├── favorite.py
│   │   │   ├── history.py
│   │   │   └── travel.py
│   │   ├── database/
│   │   │   ├── connection.py
│   │   │   └── base.py
│   │   └── core/
│   │       └── config.py
│   ├── tests/
│   │   └── test_api.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          (shadcn components)
│   │   │   ├── Header.jsx
│   │   │   ├── ConverterCard.jsx
│   │   │   ├── CurrencySelector.jsx
│   │   │   ├── RateChart.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── ConversionHistory.jsx
│   │   │   └── TravelBudget.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── hooks/
│   │   │   ├── useConversion.js
│   │   │   ├── useHistoricalRates.js
│   │   │   └── useFavorites.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── lib/
│   │   │   └── utils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/currencies` | List available currencies |
| GET | `/api/convert?from=USD&to=INR&amount=100` | Convert currency |
| GET | `/api/history?from=USD&to=INR&days=30` | Historical rates |
| GET | `/api/favorites` | List favorites |
| POST | `/api/favorites` | Add favorite |
| DELETE | `/api/favorites/{id}` | Remove favorite |
| GET | `/api/conversions` | Conversion history |
| POST | `/api/travel-budget` | Travel budget calculator |

---

## Database Schema

### favorites
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| source_currency | VARCHAR(3) | Source currency code |
| target_currency | VARCHAR(3) | Target currency code |
| created_at | DATETIME | Creation timestamp |

### conversion_history
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| source_currency | VARCHAR(3) | Source currency code |
| target_currency | VARCHAR(3) | Target currency code |
| amount | FLOAT | Input amount |
| converted_amount | FLOAT | Result amount |
| exchange_rate | FLOAT | Rate used |
| created_at | DATETIME | Conversion timestamp |

### rate_cache
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| cache_key | VARCHAR(255) | Unique cache key |
| data | TEXT | JSON cached data |
| expires_at | DATETIME | Cache expiration |
| created_at | DATETIME | Creation timestamp |

---

## Environment Variables

### Backend (`backend/.env`)

```
EXCHANGE_RATE_API_KEY=your_api_key_here
EXCHANGE_RATE_BASE_URL=https://v6.exchangerate-api.com/v6
DATABASE_URL=sqlite:///./fxflow.db
```

---

## Local Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- ExchangeRate API key (free at https://www.exchangerate-api.com/)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API key
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies `/api` requests to the backend at `http://localhost:8000`.

---

## Running Tests

```bash
cd backend
pytest tests/ -v
```

---

## Caching Strategy

- **Live rates**: Cached for 5 minutes in SQLite
- **Historical data**: Cached for 1 hour in SQLite
- If the external API is unavailable, cached data is returned when possible

---

## Future Improvements

- Currency comparison across multiple pairs
- Alerts for rate thresholds
- Dark/light theme toggle
- PWA support
- Rate prediction/forecasting
- Multi-language support

---

## Deploying to Vercel

This repository is configured as a Vercel project with the React frontend as the static build and FastAPI exposed through the serverless entrypoint at `api/index.py`.

### 1. Create a persistent database

Vercel's filesystem is ephemeral, so use a hosted PostgreSQL database for favorites, conversion history, and the rate cache. Neon, Supabase, and Vercel Postgres are suitable options. Copy the provider's SQLAlchemy connection URL.

### 2. Import the repository into Vercel

1. Push the project to GitHub, GitLab, or Bitbucket.
2. In Vercel, choose **Add New Project** and import the repository.
3. Leave the project root as the repository root.
4. Vercel will use `vercel.json` to build `frontend` and route `/api/*` to FastAPI.

### 3. Add Vercel environment variables

Add these variables in **Project Settings > Environment Variables**:

```text
EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key
EXCHANGE_RATE_BASE_URL=https://v6.exchangerate-api.com/v6
FRANKFURTER_BASE_URL=https://api.frankfurter.dev/v1
DATABASE_URL=your_postgresql_connection_url
```

Do not commit `.env` files or API keys. The frontend uses same-origin `/api` requests, so no frontend API URL variable is required.

### 4. Deploy and verify

After deployment, verify:

```text
https://your-domain.vercel.app/api/health
```

It should return:

```json
{"status":"ok"}
```

Then test conversion, historical rates, favorites, history, and Travel Budget from the deployed UI. Each new Git push can trigger a new Vercel deployment.

### Local deployment-equivalent checks

```bash
python -m compileall backend/app
cd backend && pytest tests/ -v
cd ../frontend && npm run build
```
