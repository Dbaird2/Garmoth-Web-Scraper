# conftest.py
import pytest
from unittest.mock import AsyncMock
from datetime import date, timedelta

def pytest_configure(config):
    config.addinivalue_line("markers", "asyncio: mark test as async")
    
def make_price_rows(item_name, base_price, event_start=None):
    event_start = event_start or date.today()
    return [
        {'item': item_name, 'price': base_price, 'recent_time': event_start - timedelta(days=i)}
        for i in range(1, 22)  # 21 days back
    ]

@pytest.fixture
def mock_db():
    db = AsyncMock()
    db.selectBaselinePriceRange.return_value = make_price_rows('Test Item', 1000)
    db.selectItemRecentPrice.return_value = [{'full_price': 500}]  # 50% drop → High
    return db