import state
from fastapi import WebSocket, WebSocketDisconnect, APIRouter
from services.events import fetchAllItems
import logging
import json
from services.background import fetchAndBroadcastItems

logger = logging.getLogger(__name__)
router = APIRouter(tags=["communicate"])

@router.websocket("/communicate")
async def websocket_endpoint(websocket: WebSocket):
    try:
        await websocket.accept()
        await state.item_manager.connect(websocket)
        # items = await fetchAllItems()
        items = await state.cache.get("items:all")
        if items:
            items = json.loads(items)
        else:
            logger.warning("Cache miss on items:all — falling back to DB fetch")
            items = await fetchAndBroadcastItems()  # see note below

        await state.item_manager.send_personal_message(items, websocket)
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        state.item_manager.disconnect(websocket)
   