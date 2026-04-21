from fastapi import APIRouter, Request, HTTPException
import state 
from Pydantics.models import EventForm
import logging

router = APIRouter(tags=["events"])
logger = logging.getLogger(__name__)

@router.post("/addEvent")
@state.limiter.limit("3/minute")
async def addEvent(request: Request, event_data: EventForm):
    try:
        await state.event_db.insertEvent(event_data)
    except Exception as e:
        logger.exception("addEvent failed for form_data=%s", event_data)
        raise HTTPException(status_code=500, detail=str(e))
    