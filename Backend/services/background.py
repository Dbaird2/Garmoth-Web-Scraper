from services.dashboard import getIndirectItems
from services.predictions import predictWeek
from discord_webhook import sendDiscordMessage
from Backend import state
import pandas as pd
import asyncio
import json
import logging
from misc_functions import recalculateAllEventImpacts

logger = logging.getLogger(__name__)

async def repeatInsert():

    logger.info("repeatInsert loop started")

    while True:
        # Fetch items and broadcast to WebSocket clients
        try:
            await fetchAndBroadcastItems()
        except Exception as e:
            logger.exception("Failed to build item list from DB rows: %s", e)
        
        # Recalculate event impacts and broadcast to dashboard clients
        try:
            await recalEventImpact()
        except Exception as e:
            logger.exception("Scheduled impact update failed: %s", e)
        
        # Check for recent drops and send Discord message if any
        try:
            await recentDropsCheck()
        except Exception as e:
            logger.exception("Recent Drops failed in main.py failed: %s", e)
        
        # Update predicted prices for all items in the background
        try:
            await updatePredictions()
        except Exception as e:
            logger.exception("Background predicted price update failed: %s", e)

        await asyncio.sleep(3600)

async def recentDropsCheck():
    items = await state.item_db.recentDrops()
    if not items:
        return 
    string = "Items Recently dropped:"
    # Check if items are in already in the message to avoid duplicates
    # Format: percentage, stock, price::numeric(15,1) AS full_price
    for item in items:
        if await state.cache.sismember("announced_drops", item[0]):
            continue

        # percentage, stock, price::numeric(15,1) AS full_price
        string += f"\n{item[0]}: {item[1]:.2f}% | Stock: {item[2]} | Current Price: {item[3]:.2f}"
        await state.cache.sadd("announced_drops", item[0])
        await state.cache.expire("announced_drops", 86400)

    if string != "Items Recently dropped:":
        await sendDiscordMessage(string, 'item_drop')

async def recalEventImpact():
    await recalculateAllEventImpacts(state.event_db)
    event_dict = await getIndirectItems()
    await state.dash_manager.broadcast(event_dict)

async def fetchAndBroadcastItems():
    items = await state.item_db.selectAllItemRows()
    item_list = []
    for item in items:
        item_list.append({'id': item[0], 'name': item[1], 'percentage': item[2], 'stock': item[3], 'price': float(item[4]), 'percent_diff': item[5] if item[5] is not None else 0, 'price_diff': item[6] if item[6] is not None else 0, 'category': item[7] if item[7] is not None else ''})
    
    logger.info("Broadcasting %d items to connected clients", len(item_list))
    await state.cache.set("items:all", json.dumps(item_list), ex=7200)
    await state.item_manager.broadcast(item_list)

async def updatePredictions():
    items = await state.invest_db.uniqueInvestments()
    for item in items:
        item_name = item[0]
        try:
            df_latest = await state.item_db.getRecentPriceHistory(item_name, days=30)
            df_latest = pd.DataFrame(df_latest, columns=['recent_time', 'percentage', 'item', 'stock', 'price'])
            item_predictions = predictWeek(item_name, df_latest)
            await state.invest_db.upsertPredictedPrices(item_name, item_predictions)
            await state.cache.set(f"predicted_price:{item_name}", json.dumps(item_predictions), ex=3600)
        except Exception as e:
            logger.exception("Prediction failed for item=%s | error: %s", item_name, e)