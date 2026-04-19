import os
from db import Database
from web_socket import ConnectionManager
import redis.asyncio as aioredis
import asyncio
import logging
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

db = Database()
redis = aioredis.from_url(os.getenv("REDIS_URL"), decode_responses=True)

item_manager = ConnectionManager()
dash_manager = ConnectionManager()
investment_manager = ConnectionManager()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger(__name__)