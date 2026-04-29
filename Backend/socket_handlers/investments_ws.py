from fastapi import WebSocket, WebSocketDisconnect, APIRouter
import state
from routers.auth import checkJWT
from services.predictions import getFormattedInvestmentData
import logging 

router = APIRouter(tags=["investmentWs"])
logger = logging.getLogger(__name__)

@router.websocket("/investmentWs")
async def investments_ws(websocket: WebSocket, token: str):
    logger.debug("/investmentWs called token=%s", token)
    try:
        payload = await checkJWT(token)
        if not payload:
            await websocket.close(code=1008, reason="Invalid or expired token")
            return
        email = payload["sub"]
    except Exception as e:
        logger.exception("JWT validation failed: %s", e)
        await websocket.close(code=1008, reason="Invalid token")
        return

    await state.investment_manager.connect(websocket)
    formatted_investments = await getFormattedInvestmentData(email)
    await state.investment_manager.send_personal_message(formatted_investments, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            try:
                if data.get('create'):
                    await state.invest_db.upsertInvestment(email, data.get('create'))
                elif data.get('update'):
                    await state.invest_db.updateInvestment(data.get('delete'))
                elif data.get('sold_all'):
                    await state.invest_db.soldAllInvestment(data.get('sold_all'))
                elif data.get('delete'):
                    await state.invest_db.deleteInvestment(data.get('delete'))
                else:
                    continue
                    
                formatted_investments = await getFormattedInvestmentData(email)
                await state.investment_manager.send_personal_message(formatted_investments, websocket)

            except Exception as e:
                logger.exception("Investment WS operation failed — email=%s | error: %s", email, e)
                await websocket.send_json({"error": "Operation failed, please try again"})

    except WebSocketDisconnect:
        state.investment_manager.disconnect(websocket)