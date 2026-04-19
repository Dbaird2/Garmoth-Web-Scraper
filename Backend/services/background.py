from services.dashboard import getIndirectItems
from services.predictions import predictWeek
from discord_webhook import sendDiscordMessage
from state import db, item_manager, dash_manager, investment_manager, logger
import pandas as pd

async def repeatInsert():
    from misc_functions import recalculateAllEventImpacts

    logger.info("repeatInsert loop started")

    while True:
        # Fetch items and broadcast to WebSocket clients
        try:
            items = await db.selectAllItemRows()
            item_list = []
            for item in items:
                item_list.append({'id': item[0], 'name': item[1], 'percentage': item[2], 'stock': item[3], 'price': float(item[4]), 'percent_diff': item[5] if item[5] is not None else 0, 'price_diff': item[6] if item[6] is not None else 0, 'category': item[7] if item[7] is not None else ''})
            
            logger.info("Broadcasting %d items to connected clients", len(item_list))
            await item_manager.broadcast(item_list)
        except Exception as e:
            logger.exception("Failed to build item list from DB rows: %s", e)
        
        # Recalculate event impacts and broadcast to dashboard clients
        try:
            await recalculateAllEventImpacts(db)
            event_dict = await getIndirectItems()
            await dash_manager.broadcast(event_dict)
        except Exception as e:
            logger.exception("Scheduled impact update failed: %s", e)
        
        # Check for recent drops and send Discord message if any
        try:
            items = await db.recentDrops()
            if items is not None:
                string = "Items Recently dropped:"
                # Check if items are in already in the message to avoid duplicates
                seen_items = await db.announcedDrops()
                # Format: percentage, stock, price::numeric(15,1) AS full_price
                for item in items:
                    if item[0] in seen_items:
                        continue
                    # percentage, stock, price::numeric(15,1) AS full_price
                    string += f"\{item[0]}: {item[1]:.2f}% | Stock: {item[2]} | Current Price: {item[3]:.2f}"                
                if string != "Items Recently dropped:":
                    await sendDiscordMessage(string, 'item_drop')
        except Exception as e:
            logger.exception("Recent Drops failed in main.py failed: %s", e)
        
        # Update predicted prices for all items in the background
        try:
            items = await db.uniqueInvestmentItems()
            for item in items:
                df_latest = await db.getRecentPriceHistory(item, days=30)
                df_latest = pd.DataFrame(df_latest, columns=['recent_time', 'percentage', 'item', 'stock', 'price'])
                item_predictions = predictWeek(item, df_latest)
                await db.insertPredictedPrices(item, item_predictions)
                # await redis.set(f"predicted_price:{item}", str(item_predictions), ex=3600)  # Cache for 1 hour
        except Exception as e:
            logger.exception("Background predicted price update failed: %s", e)

        await asyncio.sleep(3600)