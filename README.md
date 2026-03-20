# Garmoth Web Scraper

Real-time Black Desert Online market data tracker with live WebSocket updates, price history charts, and advanced filtering.

![Tests](https://github.com/Dbaird2/Garmoth-Web-Scraper/actions/workflows/test.yml/badge.svg)

## Overview

Scrapes BDO market data every 10 minutes using headless Chrome, stores time-series price and stock data in PostgreSQL, and pushes live updates to connected React clients via WebSockets. Users can filter by % change threshold, search by name, sort by any column, and view historical price charts per item.

## Tech Stack

**Backend**
- FastAPI — async REST + WebSocket endpoints with lifespan context manager
- asyncpg — connection pool, bulk `unnest` inserts, `ON CONFLICT` upserts
- undetected-chromedriver — headless Selenium with Cloudflare bypass
- Pytest — async DB tests, TestClient API tests, AsyncMock WebSocket tests

**Frontend**
- React + Vite — custom hooks (`useWebSocket`, `useFilter`), component architecture
- Recharts — `LineChart` price history per item in modal
- Tailwind CSS — dark theme, teal accent, responsive grid

**Infrastructure**
- PostgreSQL — time-series schema with `(item, recent_time)` unique constraint
- GitHub Actions — CI runs pytest suite on every push to main

## Architecture

```
Local Machine (Selenium scraper)
    ↓ scrapes every 10 mins
FastAPI (background task)
    ↓ bulk upserts via unnest
PostgreSQL
    ↑ queries on WS connect + after each scrape
FastAPI WebSocket
    ↓ broadcasts JSON to all clients
React / Vite frontend
```

## Key Features

- Scrapes 13 BDO market categories in a single headless browser session
- WebSocket connection broadcasts fresh data to all clients after each scrape
- `% change` slider filter, item name search, multi-column sort
- Per-item price and % difference vs previous day's data
- Recharts `LineChart` price history in per-item modal
- Bulk DB inserts via PostgreSQL `unnest` for performance
- Full pytest suite covering DB queries, API endpoints, and WebSocket manager

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
```

### Running tests

```bash
cd Backend
pytest unit_tests/ -v
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/items/all` | All items for today ordered by % change |
| GET | `/items/{item_name}` | Single item history |
| GET | `/items/range/{percentage}` | Items outside ±% threshold |
| WS | `/communicate` | WebSocket — live market updates |

## To-do

### In progress

- [ ] Loading states — spinner on WS connect, skeleton cards, chart fetch indicator
- [X] Pagination or virtual scrolling — performance fix for 500+ items
- [ ] Dark/light mode toggle — Tailwind `dark:` classes + navbar button
- [ ] Export to CSV — client-side download of current filtered list

### Planned

- [ ] Docker + docker-compose — containerize FastAPI + Postgres for local dev
- [ ] Deploy — Render (FastAPI) + Supabase (DB) + Vercel (React frontend)
- [ ] Watchlist — pin items to top via localStorage UUID, no accounts needed

## License

MIT
