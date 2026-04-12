from app.db.database import db
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

async def fetch_all_items():
    try:
        items = await db.selectAllItemRows()
        if items == "Items Not Found":
            raise HTTPException(status_code=404, detail="Items not found")
        item_list = []
        for item in items:
            item_list.append({
                'id': item[0],
                'name': item[1],
                'percentage': item[2],
                'stock': item[3],
                'price': float(item[4]),
                'percent_diff': item[5] if item[5] is not None else 0,
                'price_diff': item[6] if item[6] is not None else 0,
                'category': item[7] if item[7] is not None else ''
            })
        return item_list
    except Exception as e:
        logger.exception("fetchAllItems failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

async def get_single_item(item_name: str):
    try:
        item = await db.selectItem(item_name)
        return item
    except Exception as e:
        logger.exception("getItem failed for %s: %s", item_name, e)
        raise

async def get_items_by_percent_range(percentage: int):
    try:
        items = await db.selectItemsByRange(percentage)
        return items
    except Exception as e:
        logger.exception("getItemsByPercentRange failed: %s", e)
        raise

async def get_indirect_items():
    # Your full getIndirectItems logic goes here (I can expand this if you want)
    # For now, paste your original function body here and adjust imports
    ...
    # (I'll provide the full version in the next message if this gets too long)