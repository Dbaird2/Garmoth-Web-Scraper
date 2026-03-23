# test_db.py
import pytest
import pytest_asyncio
from db import Database

@pytest_asyncio.fixture
async def test_db():
    db = Database()
    await db.connect()
    yield db
    await db.closeConnection()

@pytest.mark.asyncio
async def test_select_all_items(test_db):
    items = await test_db.selectAllItemRows()
    print(items)
    assert isinstance(items, list)
    assert len(items) >= 0