# test_functions.py
from misc_functions import getBaselineAvg, calculateImpactLevel, higherImpact, calculatePctDiff
import pytest
from datetime import date

def test_calculateImpactLevel_high_directional():
    assert calculateImpactLevel(-200, directional=True) == "Very High"

def test_calculateImpactLevel_high_directional():
    assert calculateImpactLevel(-100, directional=True) == "High"

def test_calculateImpactLevel_medium_directional():
    assert calculateImpactLevel(-50, directional=True) == "Medium"

def test_calculateImpactLevel_low_directional():
    assert calculateImpactLevel(-15.5, directional=True) == "Low"

def test_calculateImpactLevel_none_directional():
    assert calculateImpactLevel(-10, directional=True) == "None"

def test_calculateImpactLevel_positive_ignored_directional():
    assert calculateImpactLevel(50, directional=True) == "None"

def test_calculateImpactLevel_high_indirect():
    assert calculateImpactLevel(100, directional=False) == "High"

def test_calculateImpactLevel_none_indirect():
    assert calculateImpactLevel(10, directional=False) == "None"

def test_getBaselineAvg_normal():
    rows = [{'price': 100}, {'price': 200}, {'price': 300}]
    assert getBaselineAvg(rows) == 200.0

def test_getBaselineAvg_empty():
    assert getBaselineAvg([]) is None

def test_getBaselineAvg_zero():
    assert getBaselineAvg([{'price': 0}]) is None

def test_higher_impact():
    assert higherImpact('High', 'Low') == 'High'
    assert higherImpact('None', 'Medium') == 'Medium'
    assert higherImpact('Medium', 'Medium') == 'Medium'

@pytest.mark.asyncio
async def test_calculatePctDiff_normal(mock_db):
    mock_db.selectBaselinePriceRange.return_value = [
        {'price': 1000}, {'price': 1000}, {'price': 1000}
    ]
    mock_db.selectItemRecentPrice.return_value = [{'full_price': 500}]
    result = await calculatePctDiff(mock_db, 'Test Item', date.today())
    assert result == -50.0

@pytest.mark.asyncio
async def test_calculatePctDiff_empty_baseline(mock_db):
    mock_db.selectBaselinePriceRange.return_value = []
    result = await calculatePctDiff(mock_db, 'Test Item', date.today())
    assert result is None

@pytest.mark.asyncio
async def test_calculatePctDiff_empty_recent_price(mock_db):
    mock_db.selectBaselinePriceRange.return_value = [{'price': 1000}]
    mock_db.selectItemRecentPrice.return_value = []
    result = await calculatePctDiff(mock_db, 'Test Item', date.today())
    assert result is None

@pytest.mark.asyncio
async def test_calculatePctDiff_zero_baseline(mock_db):
    mock_db.selectBaselinePriceRange.return_value = [{'price': 0}]
    result = await calculatePctDiff(mock_db, 'Test Item', date.today())
    assert result is None

