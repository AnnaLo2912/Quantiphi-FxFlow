# FxFlow - Project Documentation

## Architecture Overview

FxFlow is a **full-stack real-time currency converter** built with:
- **Frontend:** React + Vite + Tailwind CSS (runs on port 5173)
- **Backend:** Python + FastAPI (runs on port 8000)
- **Database:** SQLite (file: `fxflow.db`)
- **External API:** ExchangeRate-API (live currency rates)

### How It Works (Simple Terms)

```
User opens browser
        ↓
React frontend loads (port 5173)
        ↓
User selects currencies, enters amount
        ↓
Frontend sends request to /api/convert
        ↓
FastAPI backend receives request (port 8000)
        ↓
Backend calls ExchangeRate-API for live rate
        ↓
Rate cached in SQLite for 5 minutes
        ↓
Result returned to frontend
        ↓
User sees converted amount + chart + history
```

### API Proxy

Vite dev server proxies `/api/*` requests to `localhost:8000` (backend). This means frontend code just calls `/api/convert` and Vite forwards it to the backend automatically.

---

## Backend Services (What Each Does)

### 1. Exchange Rate Service (`exchange_rate.py`)

**Purpose:** Fetch and cache live currency rates.

**Logic:**
```
get_live_rate(base, target):
  1. Check SQLite cache for key "live:USD:INR"
  2. If cache exists and not expired (5 min TTL) → return cached rate
  3. If no cache → call ExchangeRate-API: https://v6.exchangerate-api.com/v6/{KEY}/latest/USD
  4. Extract rate for target currency from response
  5. Save to cache with expiry time
  6. Return rate
```

**Historical Data (Frankfurter API):**
```
get_historical_data(base, target, days=30):
  1. Build a date range ending today and covering the requested number of days
  2. Request real daily rates from Frankfurter: https://api.frankfurter.dev/v1/{start}..{end}?base={base}&symbols={target}
  3. Sort the API's date-keyed rates chronologically
  4. Convert them to an array of {date, rate} objects for the chart
  5. Cache the result for 1 hour
```

Frankfurter returns rates for available market days, so weekends and holidays may not have data points. Historical data is cached for one hour.

### 2. Conversion Service (`conversion.py`)

**Purpose:** Convert amounts between currencies and save to history.

**Logic:**
```
convert(db, from, to, amount):
  1. Validate currencies exist (3-letter codes)
  2. Call get_live_rate(from, to) to get exchange rate
  3. Calculate: converted_amount = amount × rate
  4. Save to conversion_history table (for recent conversions list)
  5. Return {from, to, amount, rate, converted_amount, timestamp}
```

### 3. Favorites Service (`favorites.py`)

**Purpose:** Save/delete/list favorite currency pairs.

**Logic:**
```
add_favorite(db, source, target):
  1. Check if pair already exists in favorites table
  2. If exists → raise ValueError("Favorite already exists")
  3. If not → insert into favorites table
  4. Return the new favorite object

get_favorites(db):
  1. Query all favorites, ordered by created_at DESC (newest first)
  2. Return list

delete_favorite(db, favorite_id):
  1. Find favorite by ID
  2. If not found → return False
  3. If found → delete from database
  4. Return True
```

### 4. Travel Budget Service (`travel_budget.py`)

**Purpose:** Convert a budget amount to multiple currencies for travel comparison.

**Logic:**
```
calculate_travel_budget(db, base_currency, amount):
  1. Get live rate from base_currency to USD (as reference)
  2. For each major currency (EUR, GBP, INR, JPY, etc.):
     - Calculate: amount_in_target = amount × (target_rate / base_rate)
  3. Filter out base_currency from results
  4. Return list of {currency, amount} objects
```

### 5. Currencies Service (`currencies.py`)

**Purpose:** Provide list of 150+ world currencies for dropdowns.

**Logic:**
```
list_currencies(db):
  1. Try to fetch from ExchangeRate-API: /codes endpoint
  2. If API returns >10 currencies → use API data
  3. If API fails or returns few results → use hardcoded FULL_CURRENCY_LIST (164 currencies)
  4. Cache result for 1 hour
  5. Return {currencies: [{code: "USD", name: "United States Dollar"}, ...]}
```

---

## Frontend Components (What Each Does)

### 1. ConverterCard
- Two searchable dropdowns (CurrencySelect) for From/To
- Input field for amount
- "Convert" button → calls POST /api/convert
- Shows result with rate info
- "Save" button → calls POST /api/favorites
- Swap button → swaps From/To currencies

### 2. RateChart
- Two CurrencySelect dropdowns for manual pair selection
- Swap button between selectors
- Fetches 30-day historical data from /api/history
- Renders LineChart using Recharts
- Shows current rate, 30-day change percentage
- Syncs with ConverterCard by default, but can be changed independently

### 3. Favorites
- Fetches saved pairs from GET /api/favorites
- Displays as clickable pills with flags
- Click pill → sets ConverterCard to that pair
- X button → calls DELETE /api/favorites/{id}
- Shows "Save pairs from the converter" when empty
- Scrollable when >5 favorites

### 4. ConversionHistory
- Fetches from GET /api/conversions
- Table showing recent conversions: From, To, Rate, Converted Amount
- Shows max 8 most recent
- Shows "No Conversions Yet" when empty

### 5. TravelBudget
- Toggle switch (ON/OFF)
- Currency selector + amount input + Calculate button
- Calls POST /api/travel-budget
- Shows table of converted amounts in major currencies

### 6. CurrencySelect
- Custom searchable dropdown (replaces Radix Select)
- Search by currency code or name
- Shows flag emoji for each currency
- Checkmark on selected currency

### 7. Header
- FxFlow logo + "Live Rates" badge (green pulsing dot)
- Dark/Light mode toggle button

### 8. BackgroundEffect
- Subtle animated particle canvas (green dots floating)
- Purely decorative

---

## Database Schema

### favorites table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| source_currency | STRING(3) | e.g., "USD" |
| target_currency | STRING(3) | e.g., "INR" |
| created_at | DATETIME | When saved (UTC, naive) |

### conversion_history table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| source_currency | STRING(3) | e.g., "USD" |
| target_currency | STRING(3) | e.g., "INR" |
| amount | FLOAT | Original amount |
| exchange_rate | FLOAT | Rate used |
| converted_amount | FLOAT | Result amount |
| created_at | DATETIME | When converted (UTC, naive) |

### rate_cache table
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| cache_key | STRING | e.g., "live:USD:INR" or "currencies" |
| data | TEXT | JSON string of cached data |
| expires_at | DATETIME | When cache expires |

---

## Issues Faced & Fixes

### Issue 1: Historical Data Not Loading (White Chart)
**Problem:** Chart showed "Unable to load historical data" or stayed blank.
**Root Cause:** ExchangeRate-API free tier doesn't support per-pair historical endpoints. The frontend was waiting for real historical data that never came.
**Fix:** Created synthetic historical data generator using seeded random walk. Generates 30 days of realistic-looking data anchored to the current live rate. Same currency pair always shows the same chart (deterministic via hash seed).

### Issue 2: Currency List Only Showing USD Currencies
**Problem:** Dropdowns only showed ~10 currencies instead of 150+.
**Root Cause:** The `/codes` API endpoint was failing silently, and the fallback condition checked `len(result["currencies"]) > 10` which filtered partial results.
**Fix:** Added a hardcoded list of 164 currencies in `currencies.py` as fallback. If API returns fewer than 10 currencies, the hardcoded list is used instead.

### Issue 3: Favorites Not Saving/Displaying
**Problem:** Clicking "Save" showed "Saved" but favorites list stayed empty.
**Root Cause:** Two issues:
1. `onError` handler in ConverterCard incorrectly set `favSaved(true)` on error (showed success on failure)
2. Duplicate favorites returned 409 error which triggered the bug
**Fix:** Fixed `onError` to properly handle "already exists" vs real errors. Added `queryClient.invalidateQueries` to refresh favorites list after mutation.

### Issue 4: Timezone Errors in SQLite
**Problem:** SQL queries failed with timezone comparison errors.
**Root Cause:** Some datetimes were timezone-aware (`datetime.now(timezone.utc)`) while SQLite stored naive datetimes. Comparing them caused errors.
**Fix:** Changed all datetimes to use `datetime.utcnow()` (naive, no timezone info). All datetimes are consistent.

### Issue 5: Light Mode Input Fields Too Dark
**Problem:** In light mode, input fields had dark navy/black backgrounds making text unreadable.
**Root Cause:** Input component used `bg-muted/30` which in dark mode is dark, but the same class was applied in light mode where it created poor contrast.
**Fix:** Added explicit CSS rules:
- Light mode inputs: `background-color: var(--color-background)` (white)
- Dark mode inputs: `background-color: var(--color-secondary)` (#1a1a1a)
- Changed `--color-input` from `#e5e5e5` to `#d4d4d4` for better visibility

### Issue 6: Cards Taking Too Much Space
**Problem:** Dashboard cards had large padding/spacing, wasting screen space.
**Root Cause:** Default padding `p-5` on all cards, `h-12` inputs, `gap-4` grid spacing.
**Fix:** Reduced all padding to `p-4` or `p-3`, inputs to `h-10`, grid gap to `gap-3`, header height to `h-12`. Favorites card got max-height with scroll overflow.

### Issue 7: ConverterCard Grid Layout Too Wide
**Problem:** The From/Amount/Swap/To/Result layout was too spread out.
**Root Cause:** Using `grid-cols-[1fr,auto,1fr]` with large gaps and tall elements.
**Fix:** Reduced input heights, swap button size, spacing between elements, and removed nested Card wrapper from conversion details.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/convert?from=USD&to=INR&amount=100` | Convert currency |
| GET | `/api/history?from=USD&to=INR&days=30` | Get 30-day historical data |
| GET | `/api/favorites` | List saved favorites |
| POST | `/api/favorites` | Add favorite (body: {from, to}) |
| DELETE | `/api/favorites/{id}` | Remove favorite |
| GET | `/api/conversions` | Get conversion history |
| POST | `/api/travel-budget` | Calculate travel budget |
| GET | `/api/currencies` | Get all 150+ currencies |
| GET | `/api/health` | Health check |

---

## Environment Variables

**Backend `.env`:**
```
EXCHANGE_RATE_API_KEY=cf4e766d76b86a661ca4c636
EXCHANGE_RATE_BASE_URL=https://v6.exchangerate-api.com/v6
DATABASE_URL=sqlite:///./fxflow.db
```

---

## How to Run

```bash
# Backend
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## Deployment (Vercel)

The `vercel.json` configures:
- Frontend build: `cd frontend && npm install && npm run build`
- Output: `frontend/dist`
- API rewrite: `/api/*` → backend

**Note:** Backend needs separate hosting (Railway, Render, etc.) since SQLite requires filesystem access which Vercel serverless functions don't provide persistently.
