# Garmoth — Black Desert Online Market Tracker

Garmoth is a full-stack market intelligence application for Black Desert Online. It tracks item prices across the in-game marketplace and analyzes the economic impact of game events — surfacing which items are meaningfully affected, by how much, and why.

Live: [garmoth.vercel.app](https://garmoth-web-scraper.vercel.app) *(backend hosted on Render — allow a few seconds for cold start)*

---

## What It Does

Black Desert Online runs limited-time events that reliably shift the in-game economy. Garmoth quantifies those shifts by comparing current item prices against a pre-event baseline, then classifies the impact and surfaces the results in real time through a WebSocket-powered dashboard.

### Event Impact Analysis

The core feature is an algorithmic system that detects and classifies market impact for both directly and indirectly affected items.

**Baseline & threshold detection**

For each active event, Garmoth computes a 3–7 day pre-event price baseline per item. The percentage difference between the baseline and current price is compared against calibrated thresholds:

| Impact Level | Threshold |
|---|---|
| None | < 15.5% |
| Low | 15.5% – 30% |
| Medium | 30% – 50% |
| High | 50%+ |

The 15.5% floor is derived from BDO's in-game market tax — movements below that threshold are economically indistinguishable from noise. High impact is treated as a ceiling: once an item reaches High, it cannot be downgraded by subsequent recalculations.

**Indirect market pressure**

Beyond items explicitly tied to an event, Garmoth models second-order effects through a `CATEGORY_SIDE_EFFECTS` mapping. For example, a costume event increases player enhancement activity, which drives up demand for Sharp and Hard Black Crystal Shards — items not listed in the event at all. This indirect pressure is tracked separately and displayed alongside direct impact in the dashboard.

**Recalculation schedule**

Impact recalculation runs as an hourly background job piggybacked on the scraper's scheduler. WebSocket endpoints only fetch and broadcast precomputed results, keeping latency low.

---

## Tech Stack

**Backend**
- FastAPI + uvicorn
- asyncpg + PostgreSQL
- WebSockets for real-time data delivery
- SlowAPI for rate limiting

**Frontend**
- React + Vite
- Tailwind CSS
- TanStack Virtual (virtualized grid)
- Recharts

**Data Collection**
- Selenium-based scraper (runs locally)
- `httpx` calls to the arsha.io API v2

**Deployment**
- Frontend: Vercel
- Backend: Render
- Scraper: local

---

## Architecture

Garmoth uses a monorepo structure with three components:

```
/
├── Backend/       # FastAPI application, database layer, background scheduler
├── Frontend/      # React + Vite client
└── WebScraper/    # Selenium scraper and data ingestion
```

Price data is collected by the scraper and written to PostgreSQL. The backend exposes REST endpoints for item and event management, and a WebSocket endpoint that pushes the current event impact payload to connected clients. Business logic — including baseline averaging, ratio analysis, and impact classification — is handled entirely in Python, not embedded in SQL.

Data modeling separates recurring events from their individual occurrences, with junction tables used to associate items with events. Prices are stored as `BIGINT` to accommodate BDO's market values, which routinely exceed 2.1 billion silver. Items with enhancement levels use composite primary keys.

---

## Key Features

- Real-time dashboard via WebSockets
- Algorithmic event impact classification (None / Low / Medium / High)
- Indirect market pressure detection via category side-effect mapping
- Virtualized item grid for performance at scale
- Favorites / watchlist (localStorage)
- Skeleton loading states
- Keyboard shortcuts
- Dark glass UI themed to BDO's aesthetic
