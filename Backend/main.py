from Backend.socket_handlers import events_ws
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
from datetime import datetime
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
import state
from services.background import repeatInsert
from routers import items, auth, events
from socket_handlers import items_ws, investments_ws
import redis.asyncio as aioredis
import os
import logging
from Database.events import EventActions
from Database.investments import InvestmentActions
from Database.items import ItemActions

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger(__name__)

origins = [
    "https://bdo-event-tracker.vercel.app",
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    await state.db.connect()
    state.event_db = EventActions(state.db)
    state.invest_db = InvestmentActions(state.db)
    state.item_db = ItemActions(state.db)
    state.cache = aioredis.from_url(os.getenv("REDIS_URL"), decode_responses=True)

    logger.info("Database connected successfully")

    time1 = datetime.now()
    task = asyncio.create_task(repeatInsert())
    time2 = datetime.now()
    diff = time2 - time1
    logger.info("Background task created in %d.%06ds", diff.seconds, diff.microseconds)

    await asyncio.sleep(0) 
    logger.info("Background task registered: %s", task)
    task.add_done_callback(lambda t: logger.error("Background task ended — exception: %s", t.exception()) if not t.cancelled() else logger.warning("Background task was cancelled"))
    yield
    await state.db.closeConnection()
    await state.item_manager.closeConnections()
    await state.dash_manager.closeConnections()
    await state.investment_manager.closeConnections()
    logger.info("Database connection closed and WebSocket connections cleaned up")

app = FastAPI(lifespan=lifespan)
app.state.limiter = state.limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(items.router)
app.include_router(auth.router)
app.include_router(events.router)

# Include WebSocket routers
app.include_router(items_ws.router)
app.include_router(events_ws.router)
app.include_router(investments_ws.router)