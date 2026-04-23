import os
from Database.db import Database

from web_socket import ConnectionManager
import asyncio
import logging
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

db = Database()
event_db = None
invest_db = None
item_db = None

cache = None  

item_manager = ConnectionManager()
dash_manager = ConnectionManager()
investment_manager = ConnectionManager()

