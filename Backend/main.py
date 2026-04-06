from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, APIRouter, Depends, Security
from fastapi.responses import RedirectResponse
from starlette.requests import Request  
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db import Database
from contextlib import asynccontextmanager
import asyncio
import logging
from web_socket import ConnectionManager
from datetime import datetime, timedelta
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import httpx, jwt, os
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

bearer = HTTPBearer()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger(__name__)

db = Database()

item_manager = ConnectionManager()
dash_manager = ConnectionManager()
investment_manager = ConnectionManager()

origins = [
    "https://bdo-event-tracker.vercel.app",
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    logger.info("Database connected successfully")

    time1 = datetime.now()
    task = asyncio.create_task(repeatInsert())
    time2 = datetime.now()
    diff = time2 - time1
    logger.info("Background task created in %d.%06ds", diff.seconds, diff.microseconds)

    await asyncio.sleep(0) 
    logger.info("Background task registered: %s", task)
    task.add_done_callback(lambda t: logger.error("Background task ended — exception: %s", t.exception()) if not t.cancelled() else logger.warning("Background task was cancelled"))
    yield
    await db.closeConnection()
    await item_manager.closeConnections()
    await dash_manager.closeConnections()

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    name: str
    percentage: int
    stock: int
    price: float

class EventForm(BaseModel):
    event_name: str
    start_date: str
    end_date: str
    items: list[str]

async def repeatInsert():
    from misc_functions import recalculateAllEventImpacts

    logger.info("repeatInsert loop started")

    while True:
        try:
            items = await db.selectAllItemRows()
            item_list = []
            for item in items:
                item_list.append({'id': item[0], 'name': item[1], 'percentage': item[2], 'stock': item[3], 'price': float(item[4]), 'percent_diff': item[5] if item[5] is not None else 0, 'price_diff': item[6] if item[6] is not None else 0, 'category': item[7] if item[7] is not None else ''})
            
        except Exception as e:
            logger.exception("Failed to build item list from DB rows: %s", e)

        try:
            logger.info("Broadcasting %d items to connected clients", len(item_list))
            await item_manager.broadcast(item_list)
        except Exception as e:
            logger.exception("WebSocket broadcast to item_manager failed: %s", e)
        
        try:
            await recalculateAllEventImpacts(db)
            event_dict = await getIndirectItems()
            await dash_manager.broadcast(event_dict)
        except Exception as e:
            logger.exception("Scheduled impact update failed: %s", e)
        await asyncio.sleep(3600)
        

@app.get("/")
def root():
    return "URL does not have an endpoint"

@app.websocket("/communicate")
async def websocket_endpoint(websocket: WebSocket):
    try:
        await item_manager.connect(websocket)
        items = await fetchAllItems()
        await item_manager.send_personal_message(items, websocket)
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        item_manager.disconnect(websocket)
    
@app.websocket("/dashboardWs")
async def websocket_endpoint(websocket: WebSocket):
    try:
        await dash_manager.connect(websocket)
        event_dict = await getIndirectItems()
        await dash_manager.send_personal_message(event_dict, websocket)
        while True:                             
            data = await websocket.receive_text() 
    except WebSocketDisconnect:
        dash_manager.disconnect(websocket)

@app.websocket("/investmentWs")
async def investments_ws(websocket: WebSocket, token: str):
    logger.debug("/investmentWs called token=%s", token)
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        email = payload["sub"]
    except jwt.ExpiredSignatureError:
        await websocket.close(code=1008, reason="Token expired")
        return
    except jwt.InvalidTokenError:
        await websocket.close(code=1008, reason="Invalid token")
        return

    await investment_manager.connect(websocket)
    formatted_investments = await getFormattedInvestmentData(email)
    await investment_manager.send_personal_message(formatted_investments, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            try:
                if data.get('create') or data.get('update'):
                    await db.upsertInvestment(email, data.get('create'))
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

async def getFormattedInvestmentData(email):
    formatted_investments = {
        'positions': [],
        'chart_data': {}
    }

    user_investments = await db.getInvestments(email)
    for investment in user_investments:
        formatted_investments['positions'].append({
            'id': investment[1],
            'item': investment[0],
            'qty': investment[2],
            'buyPrice': investment[3],
            'impact': 'Low',
            'pnl': investment[4],
            'currentPrice': investment[5]
            })
    chart_data = await db.getChartInvestmentData(email)
    formatted_investments['chart_data'] = {}
    for row in chart_data:
        if row[3] not in formatted_investments['chart_data']:
            formatted_investments['chart_data'][row[3]] = []  # initialize first
        formatted_investments['chart_data'][row[3]].append({'date': row[1].isoformat(),'actual': row[5],'projected': 100000})
    return formatted_investments

async def getIndirectItems():
    indirect_items = await db.selectActiveIndirectItems()
    events = await db.selectAllEvents()
    event_dict = {}
    item_dict = {}
    json_indirect = {}
    seen_direct = set()
    for row in events:
        event = row[0]
        impact = row[1]
        start_date = row[2].strftime('%Y-%m-%d')
        end_date = row[3].strftime('%Y-%m-%d')            
        seen_direct.add((event, row[4]))
        if event not in item_dict:
            item_dict[event] = [{'name': row[4], 'impact': row[5], 'pct_diff': row[6]}]
        else:
            item_dict[event].append({'name': row[4], 'impact': row[5], 'pct_diff': row[6]})
        event_dict[event] = {
            "event": event,
            "impact": impact,
            "start_date": start_date,
            "end_date": end_date,
            "direct_items": {
                "items": sorted(item_dict[event], key=lambda x: (x['pct_diff'], x['name']))},
            "indirect_items": {
                "items": []
            }

        }
    # Build indirect lookup
    for row in indirect_items:
        event = row[1]
        item = row[2]
        pct_diff = row[3]
        end_date = row[4].isoformat()  # fix date serialization
        if event not in json_indirect:
            json_indirect[event] = []
        if (event, item) not in seen_direct:
            json_indirect[event].append({'event': event, 'item': item, 'pct_diff': pct_diff, 'end_date': end_date})
    # Merge indirect into event_dict
    for event, indirect_rows in json_indirect.items():
        if event in event_dict:
            event_dict[event]["indirect_items"] = {
                "items": sorted(indirect_rows, key=lambda x: (x['pct_diff'], x['item']))
            }
    return event_dict        

@app.get("/items/all")
@limiter.limit("5/minute")
async def getAllItems(request: Request):
    return await fetchAllItems()

async def fetchAllItems():
    try:
        items = await db.selectAllItemRows()
        if items == "Items Not Found":
            raise HTTPException(status_code=404, detail="Items not found")
        item_list = []
        for item in items:
            item_list.append({'id': item[0], 'name': item[1], 'percentage': item[2], 'stock': item[3], 'price': float(item[4]), 'percent_diff': item[5] if item[5] is not None else 0, 'price_diff': item[6] if item[6] is not None else 0, 'category': item[7] if item[7] is not None else ''})
        return item_list
    except Exception as e:
        logger.exception("fetchAllItems failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/items/{item_name}")
@limiter.limit("5/minute")
async def getItem(request: Request, item_name: str):
    try:
        item = await db.selectItem(item_name)
        if not item:
            return []
        return item
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("getItem failed for item_name=%s: %s", item_name, e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/items/range/{percentage}")
@limiter.limit("5/minute")
async def getItemsByPercentRange(request: Request, percentage: int):
    try:
        item = await db.selectItemsByRange(percentage)
        if item == "Item Not Found":
            raise HTTPException(status_code=404, detail=[])
        return item
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("getItemsByPercentRange failed for percentage=%s: %s", percentage, e)
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/addEvent")
@limiter.limit("3/minute")
async def addEvent(request: Request, event_data: EventForm):
    try:
        await db.insertEvent(event_data)
    except Exception as e:
        logger.exception("addEvent failed for form_data=%s", event_data)
        raise HTTPException(status_code=500, detail=str(e))
    
###################################################################################################
""" OAuth Login needed Functions/Routes """

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")  
JWT_SECRET = os.getenv("JWT_SECRET")

@app.get("/auth/google/login")
def googleLogin():
    url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        "&response_type=code"
        "&scope=openid email profile"
    )
    return RedirectResponse(url)

@app.get("/auth/google/callback")
async def googleCallback(code: str):
    async with httpx.AsyncClient() as client:
        # Exchange code for token
        token_res = await client.post("https://oauth2.googleapis.com/token", data={
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": REDIRECT_URI,
            "grant_type": "authorization_code",
        })
        token_data = token_res.json()

        # Get user info
        user_res = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {token_data['access_token']}"}
        )
        user = user_res.json()  # { email, name, picture }

    # Upsert user in your DB here
    await db.upsertUser(user['email'], user['name'])

    # Issue your own JWT
    payload = {
        "sub": user["email"],
        "name": user["name"],
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

    # Redirect to frontend with token
    return RedirectResponse(f"https://bdo-event-tracker.vercel.app/auth?token={token}")

def getCurrentUser(credentials: HTTPAuthorizationCredentials = Security(bearer)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.get("/investments")
async def getInvestments(user=Depends(getCurrentUser)):
    pass
