from fastapi import APIRouter, Request, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.services.item_service import fetch_all_items, get_single_item, get_items_by_percent_range

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/items", tags=["items"])

@router.get("/all")
@limiter.limit("5/minute")
async def get_all_items(request: Request):
    return await fetch_all_items()

@router.get("/{item_name}")
@limiter.limit("5/minute")
async def get_item(request: Request, item_name: str):
    try:
        item = await get_single_item(item_name)
        if not item:
            return []
        return item
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/range/{percentage}")
@limiter.limit("5/minute")
async def get_items_by_percent_range(request: Request, percentage: int):
    try:
        items = await get_items_by_percent_range(percentage)
        if items == "Item Not Found":
            raise HTTPException(status_code=404, detail=[])
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))