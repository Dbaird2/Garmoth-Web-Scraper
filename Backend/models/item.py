from pydantic import BaseModel

class Item(BaseModel):
    name: str
    percentage: int
    stock: int
    price: float

class EventItem(BaseModel):
    item: str
    qty: int

class EventForm(BaseModel):
    event_name: str
    start_date: str
    end_date: str
    items: list[EventItem]