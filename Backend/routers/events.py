from fastapi import APIRouter, Request, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.models.item import EventForm
from app.services.event_service import add_new_event

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(tags=["events"])

@router.post("/addEvent")
@limiter.limit("3/minute")
async def add_event(request: Request, event_data: EventForm):
    try:
        await add_new_event(event_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))