from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db import Database
from contextlib import asynccontextmanager
import asyncio
from web_scrape import ScrapeForItems
from web_socket import ConnectionManager
from datetime import datetime

db = Database()

manager = ConnectionManager()

origins = [
    "http://localhost:5173",
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
    await manager.closeConnections()
    task.cancel()

app = FastAPI(lifespan=lifespan)

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
    print('repeatInsert Started')
    while True:

        print("Inserting items into database...")
        loop = asyncio.get_event_loop()
            
        try:
            time1 = datetime.now()
            items = await loop.run_in_executor(None, ScrapeForItems)
            time2 = datetime.now()
            diff = time2 - time1
        except Exception as e:
            print(f"Scrape failed, retrying next cycle: {e}")

        try:
            print(f"Insertin item examples {items[0:3]}; Time took {diff.seconds}.{diff.microseconds}")
            await db.insertItemTableAsArray(items)
        except Exception as e:
            print(f"Inserting into database failed: {e}")

        try:
            items = await db.selectAllItemRows()
            item_list = []
            # print(items)
            for item in items:
                print(item)
                item_list.append({'id': item[0], 'name': item[1], 'percentage': item[2], 'stock': item[3], 'price': float(item[4]), 'percent_diff': item[5] if item[5] is not None else 0, 'price_diff': item[6] if item[6] is not None else 0})
            
        except Exception as e:
            print(f"Creating JSON array failed: {e}")

        try:
            print(f"Broadcasting Message")
            await manager.broadcast(item_list)
        except Exception as e:
            print(f"Broading casting failed: {e}")
        await asyncio.sleep(600)
        

@app.get("/")
def root():
    return "URL does not have an endpoint"

@app.websocket("/communicate")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        items = await getAllItems()
        await manager.send_personal_message(items, websocket)
        while True:                              # ← keeps connection alive
            data = await websocket.receive_text() # ← waits for client messages
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    
@app.get("/items/all")
async def getAllItems():
    try:
        items = await db.selectAllItemRows()
        # print(items)
        if items == "Items Not Found":
            raise HTTPException(status_code=404, detail="Items not found")
        item_list = []
        for item in items:
            item_list.append({'id': item[0], 'name': item[1], 'percentage': item[2], 'stock': item[3], 'price': float(item[4]), 'percent_diff': item[5] if item[5] is not None else 0, 'price_diff': item[6] if item[6] is not None else 0})
        print(item_list[0:3])
        return item_list
    except Exception as e:
        print('Error', e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/items/{item_name}")
async def getItem(item_name: str):
    item = await db.selectItem(item_name)
    if item == "Item Not Found":
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@app.get("/items/range/{percentage}")
async def getItemsByPercentRange(percentage: int):
    print(percentage)
    item = await db.selectItemsByRange(percentage)
    if item == "Item Not Found":
        raise HTTPException(status_code=404, detail="Item not found")
    return item
