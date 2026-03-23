from misc_functions import calculateImpact
from db import Database
import pytest

@pytest.mark.asyncio
async def test_calculate_impact():
    db = Database()
    await db.connect()
    result = await calculateImpact(db, [2000000,2100000,1950000,2000000,1990000,2050000], 'Memory Fragment')
    assert result == "Medium"