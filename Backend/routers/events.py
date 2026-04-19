from fastapi import APIRouter, Request, HTTPException
from state import db, logger, limiter
from Pydantics.models import EventForm

router = APIRouter(tags=["events"])

@router.post("/addEvent")
@limiter.limit("3/minute")
async def addEvent(request: Request, event_data: EventForm):
    try:
        await db.insertEvent(event_data)
    except Exception as e:
        logger.exception("addEvent failed for form_data=%s", event_data)
        raise HTTPException(status_code=500, detail=str(e))
    