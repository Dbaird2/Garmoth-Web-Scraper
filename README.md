# Garmoth Web Scraper

Real-time Black Desert Online market data tracker with live WebSocket updates, price history charts, advanced filtering, and event impact analysis.

![Tests](https://github.com/Dbaird2/Garmoth-Web-Scraper/actions/workflows/test.yml/badge.svg)

## Overview

Scrapes BDO market data twice daily using headless Chrome, stores time-series price and stock data in PostgreSQL, and pushes live updates to connected React clients via WebSockets. Users can filter by % change threshold, search by name, sort by any column, and view historical price charts per item. An event impact system automatically calculates how active in-game events affect market prices using pre-event price baselines.

## Tech Stack

**Backend**
- FastAPI — async REST + WebSocket endpoints with lifespan context manager
- asyncpg — connection pool, bulk `unnest` inserts, `ON CONFLICT` upserts
- SlowAPI — rate limiting on REST endpoints
- undetected-chromedriver — headless Selenium with Cloudflare bypass
- Pytest + AsyncMock — unit tests for impact logic, mocked DB layer

**Frontend**
- React + Vite — custom hooks (`useWebSocket`, `useFilter`), component architecture
- Recharts — `LineChart` price history per item in modal
- Tailwind CSS — dark theme, teal accent, responsive grid

**Infrastructure**
- PostgreSQL — time-series schema with `(item, recent_time)` unique constraint
- GitHub Actions — CI runs pytest suite on every push to main

## Architecture
```
Local Machine (Selenium scraper) — runs once daily, before impact refresh
    ↓ scrapes BDO market categories
FastAPI (background task)
    ↓ bulk upserts via unnest
PostgreSQL
    ↑ queries on WS connect + hourly impact refresh
FastAPI WebSocket
    ↓ broadcasts JSON to all clients
React / Vite frontend
```

## Key Features

- Scrapes 13 BDO market categories in a single headless browser session
- WebSocket connection broadcasts fresh data to all clients on connect
- Event impact system — calculates High / Medium / Low / None impact per active event using a 3–7 day pre-event price baseline; worst-case impact wins across all event items
- Side effect tracking — infers indirect market pressure from item category relationships (e.g. costume events → sharp price increases)
- `% change` slider filter, item name search, multi-column sort
- Per-item price and % difference vs previous day's data
- Recharts `LineChart` price history in per-item modal
- Bulk DB inserts via PostgreSQL `unnest` for performance
- Rate limited REST endpoints via SlowAPI

## Event Impact System

Active in-game events are tracked against a pre-event price baseline (3–7 day average before event start). Each item's current price is compared to its baseline and assigned an impact level:

| % Deviation from Baseline | Impact Level |
|---------------------------|--------------|
| < 15.5% | None |
| 15.5% – 30% | Low |
| 30% – 50% | Medium |
| 50%+ | High |

The worst impact level across all event items determines the overall event impact. Side effects (indirect price pressure from related item categories) are tracked separately but can bubble up to the overall impact level.

## Getting Started

### Prerequisites

- Python 3.13
- Node.js 18+
- PostgreSQL
- Chrome 145

### Backend
```bash
cd Backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd Frontend/web-scrape-frontend
npm install
npm run dev
```

### Database setup
```sql
CREATE TABLE bdo_items (
    id SERIAL PRIMARY KEY,
    item TEXT,
    percentage REAL,
    stock INTEGER,
    price REAL,
    recent_time DATE,
    CONSTRAINT unique_item_date UNIQUE (item, recent_time)
);

CREATE TABLE bdo_events (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE,
    impact TEXT DEFAULT 'Unknown',
    start_date DATE,
    end_date DATE
);

CREATE TABLE event_contents (
    id SERIAL PRIMARY KEY,
    event_name TEXT REFERENCES bdo_events(name),
    item_name TEXT
);
```

### Running tests
```bash
cd Backend
pytest unit_tests/ -v
```

## API Endpoints

| Method | Endpoint | Rate Limit | Description |
|--------|----------|------------|-------------|
| GET | `/items/all` | 5/min | All items for today ordered by % change |
| GET | `/items/{item_name}` | 5/min | Single item history |
| GET | `/items/range/{percentage}` | 5/min | Items outside ±% threshold |
| WS | `/ws/dashboard` | — | Live market + event updates |

## To-do

### In progress

- [ ] Loading states — spinner on WS connect, skeleton cards, chart fetch indicator
- [X] Pagination or virtual scrolling — performance fix for 500+ items
- [X] Dark/light mode toggle — Tailwind `dark:` classes + navbar button
- [ ] Export to CSV — client-side download of current filtered list
- [X] Add Events with impact level and affected items
- [X] Unit tests for impact logic (`calculateImpact`, `updateImpactLevel`)

### Planned

- [ ] Side effect category map — define all item category relationships
- [ ] Docker + docker-compose — containerize FastAPI + Postgres for local dev
- [ ] Deploy — Render (FastAPI) + Supabase (DB) + Vercel (React frontend)

## License

MIT