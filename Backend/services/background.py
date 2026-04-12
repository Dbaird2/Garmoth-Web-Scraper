import asyncio
from datetime import datetime
import logging
from app.db.database import db
from app.managers.connection_manager import item_manager, dash_manager
from app.utils.discord import send_discord_message
from app.misc_functions import recalculateAllEventImpacts
from app.services.item_service import get_indirect_items   # or wherever you put it

logger = logging.getLogger(__name__)

async def repeat_insert():
    logger.info("repeatInsert loop started")
    while True:
        try:
            items = await db.selectAllItemRows()
            item_list = []
            for item in items:
                item_list.append({
                    'id': item[0], 'name': item[1], 'percentage': item[2],
                    'stock': item[3], 'price': float(item[4]),
                    'percent_diff': item[5] if item[5] is not None else 0,
                    'price_diff': item[6] if item[6] is not None else 0,
                    'category': item[7] if item[7] is not None else ''
                })
        except Exception as e:
            logger.exception("Failed to build item list: %s", e)

        try:
            await item_manager.broadcast(item_list)
        except Exception as e:
            logger.exception("WebSocket broadcast failed: %s", e)

        try:
            await recalculateAllEventImpacts(db)
            event_dict = await get_indirect_items()
            await dash_manager.broadcast(event_dict)
        except Exception as e:
            logger.exception("Scheduled impact update failed: %s", e)

        try:
            recent_items = await db.recentDrops()
            if recent_items:
                string = "Items Recently dropped:"
                for item in recent_items:
                    string += f"\nItem: {item[0]} Percentage Now: {item[1]} Stock: {item[2]} Current Price: {item[3]}"
                await send_discord_message(string, 'item_drop')
        except Exception as e:
            logger.exception("Recent Drops failed: %s", e)

        await asyncio.sleep(3600)