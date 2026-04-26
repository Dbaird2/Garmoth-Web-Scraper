# Garmoth — Black Desert Online Market Tracker

Garmoth is a full-stack market intelligence application for Black Desert Online. It tracks item prices across the in-game marketplace and analyzes the economic impact of game events — surfacing which items are meaningfully affected, by how much, and why.

**Live:** [garmoth.vercel.app](https://garmoth-web-scraper.vercel.app) *(backend hosted on Render — allow a few seconds for cold start)*

---

## What It Does

Black Desert Online runs limited-time events that reliably shift the in-game economy. Garmoth quantifies those shifts by comparing current item prices against a pre-event baseline, then classifies the impact and surfaces the results in real time through a WebSocket-powered dashboard.

### Event Impact Analysis

The core feature is an algorithmic system that detects and classifies market impact for both directly and indirectly affected items.

**Baseline & threshold detection**

For each active event, Garmoth computes a 3–7 day pre-event price baseline per item. The percentage difference between the baseline and current price is compared against the following thresholds:

| Impact Level  | Threshold          |
|---------------|--------------------|
| None          | 0% – 15.5%         |
| Low           | 15.5% – 30%        |
| Medium        | 30% – 50%          |
| High          | 100% – 200%        |
| Very High     | 200%+              |

> The 15.5% floor is derived from BDO's in-game market tax — movements below that threshold are economically indistinguishable from noise.  
> Once an item reaches **High** or **Very High**, it cannot be downgraded by subsequent recalculations.

**Indirect market pressure**

Beyond items explicitly tied to an event, Garmoth models second-order effects through a `CATEGORY_SIDE_EFFECTS` mapping. For example, a costume event increases player enhancement activity, which drives up demand for Sharp and Hard Black Crystal Shards — items not listed in the event at all. This indirect pressure is tracked separately and displayed alongside direct impact in the dashboard.

**Recalculation schedule**

Impact recalculation runs as an hourly background job piggybacked on the scraper's scheduler. WebSocket endpoints only fetch and broadcast precomputed results, keeping latency low.

---

## Tech Stack

**Backend**
- FastAPI + uvicorn
- asyncpg + PostgreSQL
- **Redis** (caching, background task coordination, and deduplication)
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
- Scraper: local (or scheduled environment)
- Redis: hosted (Render Redis, Upstash, Redis Cloud, etc.)

---

## Architecture

Garmoth uses a monorepo structure with three main components:

```
/
├── Backend/       # FastAPI application, database layer, background scheduler
├── Frontend/      # React + Vite client
└── WebScraper/    # Selenium scraper and data ingestion
```


Price data is collected by the scraper and written to PostgreSQL. The backend exposes REST endpoints for item and event management, and a WebSocket endpoint that pushes the current event impact payload to connected clients. Business logic — including baseline averaging, ratio analysis, and impact classification — is handled entirely in Python.

**Redis is now integrated** for caching frequent queries, coordinating background jobs, preventing duplicate scraper runs, and reducing load on PostgreSQL. This has greatly improved the reliability of automatic updates.

---

## Data Updating & Reliability (Improved)

**Automatic updating has been fixed and significantly stabilized.**

Previous issues with stalled scraper jobs, missed recalculations, and inconsistent impact updates have been resolved through Redis-backed improvements.

### Key Fixes Implemented:
- Redis-based distributed locking to prevent overlapping scraper runs
- Improved retry logic and error handling in the WebScraper
- More resilient hourly impact recalculation scheduler
- Better coordination between scraper, database, and background tasks
- Enhanced logging and health monitoring

### How Updating Works Now:
1. WebScraper pulls fresh market data (arsha.io + Selenium)
2. Data is persisted to PostgreSQL
3. Redis caches recent prices and precomputed impact results
4. Hourly background job recalculates baselines and reclassifies impact levels
5. Connected clients receive live updates via WebSocket

**Running locally?**  
Make sure Redis is running and correctly configured in your `.env` file.

**Troubleshooting common issues:**
- Scraper not updating → Check Redis connection and scraper logs
- Impact levels not refreshing → Verify background scheduler is running
- Delays on cold start → Redis caching helps reduce repeated heavy queries

---

## Key Features

- Real-time dashboard via WebSockets
- Algorithmic event impact classification (None / Low / Medium / High / Very High)
- Indirect market pressure detection via category side-effect mapping
- Virtualized item grid for performance at scale
- Favorites / watchlist (localStorage)
- Skeleton loading states
- Keyboard shortcuts
- Dark glass UI themed to BDO's aesthetic

## Planned Features

- Improved event impact scoring with stock-based confidence modifiers
- Grind spot data integration from Garmoth.com
- Material price impact modeling based on grind spot meta shifts
- Free and paid tier feature segmentation
- Discord bot with tier-based access control
- Investment recommendations page ("What to buy" analysis)
- ML price forecasting model trained on price, stock, event history, and seasonal patterns
- Weekly and monthly in-game reset market tracking

---

## Currently Started

- Automatic updating / scraper reliability significantly improved
[X] Redis integration for caching and job coordination

## Bugs Known

- JWT Token not expiring in localStorage. Maybe fixed
- Bad investment names crash the ML prediction. Fix is to check for empty AND check the database if the item exists.
- Kebab Delete does not work
- Item edit in investments is not the entire page
- Wanted price does not get inserted into the database table

