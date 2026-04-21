import os
from Database.db import Database
from Database.events import EventActions
from Database.investments import InvestmentActions
from Database.items import ItemActions
from web_socket import ConnectionManager
import asyncio
import logging
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

db = Database()
event_db = EventActions(db)
invest_db = InvestmentActions(db)
item_db = ItemActions(db)

cache = None  # set during lifespan

item_manager = ConnectionManager()
dash_manager = ConnectionManager()
investment_manager = ConnectionManager()

