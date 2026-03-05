from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db import Database
from contextlib import asynccontextmanager
import asyncio

db = Database()

origins = [
    "http://localhost:5173",
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    # task = asyncio.create_task(repeatInsert())

    yield
    await db.close()
    # task.close()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific origins
    allow_credentials=True,  # Allows cookies, authorization headers, etc.
    allow_methods=["*"],     # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],     # Allows all headers
)

@app.get("/")
def root():
    return "URL does not have an endpoint"

class Item(BaseModel):
    name: str
    percentage: int
    stock: int
    price: float
    
@app.get("/items/all")
async def getAllItems():
    try:
        items = await db.selectAllItemRows()
        # print(items)
        if items == "Items Not Found":
            raise HTTPException(status_code=404, detail="Items not found")
        item_list = []
        for item in items:
            item_list.append({'id': item[0], 'name': item[1], 'percentage': item[2], 'stock': item[3], 'price': float(item[4])})
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

async def repeatInsert() -> None:
    while True:
        await db.insertItemTableAsArray()
        await asyncio.sleep(300) 