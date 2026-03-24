from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from starlette.requests import Request  
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db import Database
from contextlib import asynccontextmanager
import asyncio
from web_scrape import ScrapeForItems
from datetime import datetime, date

db = Database()

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

        loop = asyncio.get_event_loop()
            
        try:
            print(f"Starting Webscraping")
            time1 = datetime.now()
            items = await loop.run_in_executor(None, ScrapeForItems)
            time2 = datetime.now()
            diff = time2 - time1
        except Exception as e:
            print(f"Scrape failed, retrying next cycle: {e}")

        try:
            print(f"Inserting item examples {items[0:3]}; Time took {diff.seconds}.{diff.microseconds}")
            await db.insertItemTableAsArray(items)
        except Exception as e:
            print(f"Inserting into database failed: {e}")
   
        await asyncio.sleep(36000)
        

@app.get("/")
def root():
    return "This is not a real endpoint"