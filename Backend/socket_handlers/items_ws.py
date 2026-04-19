from state import item_manager
from fastapi import WebSocket, WebSocketDisconnect, APIRouter
from services.dashboard import fetchAllItems

router = APIRouter(tags=["communicate"])

@router.websocket("/communicate")
async def websocket_endpoint(websocket: WebSocket):
    try:
        await item_manager.connect(websocket)
        items = await fetchAllItems()
        await item_manager.send_personal_message(items, websocket)
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        item_manager.disconnect(websocket)
   