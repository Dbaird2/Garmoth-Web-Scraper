from fastapi import APIRouter, Request, HTTPException
from Backend.services.events import fetchAllItems, getIndirectItems
import state
import logging 

router = APIRouter(prefix="/items", tags=["items"])
logger = logging.getLogger(__name__)

@router.get("/all")
@state.limiter.limit("5/minute")
async def get_all_items(request: Request):
    return await fetchAllItems()

@router.get("/{item_name}")
@state.limiter.limit("5/minute")
async def getItem(request: Request, item_name: str):
    try:
        item = await state.item_db.selectItem(item_name)
        # predicted_price = await predictPrice(item_name)
        if not item:
            return []
        return item
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("getItem failed for item_name=%s: %s", item_name, e)
        raise HTTPException(status_code=500, detail=str(e))

    