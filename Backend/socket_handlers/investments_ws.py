from fastapi import WebSocket, WebSocketDisconnect, APIRouter
from state import investment_manager, logger, db
from routers.auth import checkJWT
from services.predictions import getFormattedInvestmentData

router = APIRouter(tags=["investmentWs"])

@router.websocket("/investmentWs")
async def investments_ws(websocket: WebSocket, token: str):
    logger.debug("/investmentWs called token=%s", token)
    try:
        payload = checkJWT(token)
        if not payload:
            await websocket.close(code=1008, reason="Invalid or expired token")
            return
        email = payload["sub"]
    except Exception as e:
        logger.exception("JWT validation failed: %s", e)
        await websocket.close(code=1008, reason="Invalid token")
        return

    await investment_manager.connect(websocket)
    formatted_investments = await getFormattedInvestmentData(email)
    await investment_manager.send_personal_message(formatted_investments, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            try:
                if data.get('create'):
                    await db.upsertInvestment(email, data.get('create'))
                elif data.get('update'):
                    await db.updateInvestment(data.get('delete'))
                elif data.get('sold_all'):
                    await db.soldAllInvestment(data.get('sold_all'))
                elif data.get('delete'):
                    await db.deleteInvestment(data.get('delete'))
                else:
                    continue
                    
                formatted_investments = await getFormattedInvestmentData(email)
                await investment_manager.send_personal_message(formatted_investments, websocket)

            except Exception as e:
                logger.exception("Investment WS operation failed — email=%s | error: %s", email, e)
                await websocket.send_json({"error": "Operation failed, please try again"})

    except WebSocketDisconnect:
        investment_manager.disconnect(websocket)