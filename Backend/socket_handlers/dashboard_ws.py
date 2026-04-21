from state import dash_manager
from fastapi import WebSocket, WebSocketDisconnect, APIRouter
from services.dashboard import getIndirectItems

router = APIRouter(tags=["dashboardWs"])

@router.websocket("/dashboardWs")
async def websocket_endpoint(websocket: WebSocket):
    try:
        await dash_manager.connect(websocket)
        cached = await cache.get("indirect_items")
        if cached:   
            await investment_manager.send_personal_message(cached, websocket)        await dash_manager.send_personal_message(event_dict, websocket)
        while True:                             
            data = await websocket.receive_text() 
    except WebSocketDisconnect:
        dash_manager.disconnect(websocket)
