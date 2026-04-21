import state
from fastapi import WebSocket, WebSocketDisconnect, APIRouter
import logging
import json 

logger = logging.getLogger(__name__)
router = APIRouter(tags=["dashboardWs"])

@router.websocket("/dashboardWs")
async def websocket_endpoint(websocket: WebSocket):
    try:
        await state.dash_manager.connect(websocket)
        cached = await state.cache.get("indirect_items")
        if cached:   
            await state.dash_manager.send_personal_message(json.loads(cached), websocket)        
        # await state.dash_manager.send_personal_message(cached, websocket)
        while True:                             
            data = await websocket.receive_text() 
    except WebSocketDisconnect:
        state.dash_manager.disconnect(websocket)
