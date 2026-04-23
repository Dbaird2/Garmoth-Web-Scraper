import state
from fastapi import WebSocket, WebSocketDisconnect, APIRouter
from Backend.services.events import fetchAllItems
import logging
import json

logger = logging.getLogger(__name__)
router = APIRouter(tags=["communicate"])

@router.websocket("/communicate")
async def websocket_endpoint(websocket: WebSocket):
    try:
        await state.item_manager.connect(websocket)
        # items = await fetchAllItems()
        items = await state.cache.get("items:all")
        if items:
            items = json.loads(items)

        await state.item_manager.send_personal_message(items, websocket)
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        state.item_manager.disconnect(websocket)
   