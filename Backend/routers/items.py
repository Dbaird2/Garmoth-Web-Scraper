from fastapi import APIRouter, Request, HTTPException
from services.dashboard import fetchAllItems, getIndirectItems
from state import db, logger, limiter

router = APIRouter(prefix="/items", tags=["items", "all"])

@router.get("/all")
@limiter.limit("5/minute")
async def get_all_items(request: Request):
    return await fetchAllItems()

@router.get("/items/{item_name}")
@limiter.limit("5/minute")
async def getItem(request: Request, item_name: str):
    try:
        item = await db.selectItem(item_name)
        # predicted_price = await predictPrice(item_name)
        if not item:
            return []
        return item
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("getItem failed for item_name=%s: %s", item_name, e)
        raise HTTPException(status_code=500, detail=str(e))

    