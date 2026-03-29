from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from starlette.requests import Request  
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db import Database
from contextlib import asynccontextmanager
import asyncio
from web_socket import ConnectionManager
from datetime import datetime, date
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded


db = Database()

item_manager = ConnectionManager()
dash_manager = ConnectionManager()

origins = [
    "https://garmoth-web-scraper.vercel.app",
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    print("Starting background task...")

    time1 = datetime.now()
    task = asyncio.create_task(repeatInsert())
    time2 = datetime.now()
    diff = time2 - time1
    print(f"Time took to create and run task {diff.seconds}.{diff.microseconds}")

    await asyncio.sleep(0) 
    print(f"Task created: {task}")
    task.add_done_callback(lambda t: print(f"Task ended: {t.exception() if not t.cancelled() else 'cancelled'}"))
    yield
    await db.closeConnection()
    await item_manager.closeConnections()
    await dash_manager.closeConnections()
    # task.cancel()

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific origins
    allow_credentials=True,  # Allows cookies, authorization headers, etc.
    allow_methods=["*"],     # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],     # Allows all headers
)

class Item(BaseModel):
    name: str
    percentage: int
    stock: int
    price: float

async def repeatInsert():
    from misc_functions import updateImpactLevel

    print('repeatInsert Started')
    while True:
        try:
            items = await db.selectAllItemRows()
            item_list = []
            for item in items:
                item_list.append({'id': item[0], 'name': item[1], 'percentage': item[2], 'stock': item[3], 'price': float(item[4]), 'percent_diff': item[5] if item[5] is not None else 0, 'price_diff': item[6] if item[6] is not None else 0})
            
        except Exception as e:
            print(f"Creating JSON array failed: {e}")

        try:
            print(f"Broadcasting Message")
            await item_manager.broadcast(item_list)
        except Exception as e:
            print(f"Broading casting failed: {e}")
        
        try:
            await updateImpactLevel(db)
        except Exception as e:
            print(f"Failed to update impact of event: {e}")
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
        while True:                              # ← keeps connection alive
            data = await websocket.receive_text() # ← waits for client messages
    except WebSocketDisconnect:
        item_manager.disconnect(websocket)
    
@app.websocket("/dashboardWs")
async def websocket_endpoint(websocket: WebSocket):

    try:
        await dash_manager.connect(websocket)
        
        events = await db.selectAllEvents()
    
        event_dict = {}
        item_dict = {}
        for row in events:
            if row[0] not in item_dict:
                item_dict[row[0]] = [{'name': row[4], 'impact': row[5]}]
            else:
                item_dict[row[0]].append({'name': row[4], 'impact': row[5]})
            event_dict[row[0]] = {
                "event": row[0],
                "impact": row[1],
                "start_date": row[2].strftime('%Y-%m-%d'),
                "end_date": row[3].strftime('%Y-%m-%d'),
                "items": item_dict[row[0]]
            }
        
        await dash_manager.send_personal_message(event_dict, websocket)
        while True:                             
            data = await websocket.receive_text() 
    except WebSocketDisconnect:
        dash_manager.disconnect(websocket)

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
            item_list.append({'id': item[0], 'name': item[1], 'percentage': item[2], 'stock': item[3], 'price': float(item[4]), 'percent_diff': item[5] if item[5] is not None else 0, 'price_diff': item[6] if item[6] is not None else 0})
        return item_list
    except Exception as e:
        print('Error', e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/items/{item_name}")
@limiter.limit("5/minute")
async def getItem(request: Request, item_name: str):
    try:
        item = await db.selectItem(item_name)
        if not item:
            raise HTTPException(status_code=404, detail=[])
        return item
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching item {item_name}: {e}")
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
        print(f"Error fetching item {percentage}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

