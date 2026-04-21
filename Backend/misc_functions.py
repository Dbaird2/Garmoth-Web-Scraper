import logging
from discord_webhook import sendDiscordMessage
import state
logger = logging.getLogger(__name__)

IMPACT_INTS = {'Very High': 4, 'High': 3, 'Medium': 2, 'Low': 1, 'None': 0}

def getBaselineAvg(price_range) -> float | None:
    """Returns the baseline average price, or None if it can't be computed."""
    if not price_range:
        return None
    avg = sum(r['price'] for r in price_range) / len(price_range)
    return None if avg == 0 else avg

def calculateImpactLevel(pct_diff: float, directional: bool = True) -> str:
    """
    Returns impact level from a pct_diff.
    directional=True  → only negative moves count (direct items, price drops from sale events)
    directional=False → absolute value used (indirect items, can move either way)
    """
    value = pct_diff if directional else abs(pct_diff)
    if value <= -200 or (not directional and value >= 200): return "Very High"
    if value <= -100 or (not directional and value >= 100): return "High"
    if value <= -50 or (not directional and value >= 50): return "Medium"
    if value <= -15.5 or (not directional and value >= 15.5): return "Low"
    return "None"

def higherImpact(a: str, b: str) -> str:
    """Returns whichever impact level is worse."""
    return a if IMPACT_INTS[a] >= IMPACT_INTS[b] else b

async def calculatePctDiff(db, item_name: str, start_date) -> float | None:
    """Fetches baseline and recent price for an item, returns pct_diff or None."""
    price_range = await state.item_db.selectBaselinePriceRange(item_name, start_date)
    baseline_avg = getBaselineAvg(price_range)
    if baseline_avg is None:
        return None
    item_data = await state.item_db.selectItemRecentPrice(item_name)
    if not item_data:
        return None
    return (int(item_data[0]["full_price"]) - baseline_avg) / baseline_avg * 100

async def recalculateAllEventImpacts(db):
    """
    Single pass over all active events.
    Computes direct + indirect item impact, determines worst-case per event,
    persists item-level records, and writes the final impact to bdo_events.
    """
    events = await state.item_db.selectAllEvents()

    # event_name → { start_date, end_date, direct_items, higherImpact }
    event_map: dict[str, dict] = {}

    for ename, curr_impact, start_date, end_date, item_name, item_impact, item_pct_diff in events:
        if ename not in event_map:
            event_map[ename] = {
                'start_date': start_date,
                'end_date': end_date,
                'direct_items': [],
                'higherImpact': 'None',
            }
        event_map[ename]['direct_items'].append(item_name)

    indirect_impact_dict: dict[str, list] = {}

    for ename, event in event_map.items():
        start_date = event['start_date']
        end_date = event['end_date']

        # --- Direct items ---
        direct_count = 0
        for item_name in event['direct_items']:
            try:
                pct_diff = await calculatePctDiff(db, item_name, start_date)
                if pct_diff is None:
                    continue
                level = calculateImpactLevel(pct_diff, directional=True)
                logger.info(
                    "Direct item — item=%s | event=%s | pct_diff=%.2f%% | level=%s",
                    item_name, ename, pct_diff, level
                )
                direct_count += await state.item_db.updateEventItem(impact=level, item=item_name, event_name=ename, pct_diff=pct_diff)
                event['higherImpact'] = higherImpact(event['higherImpact'], level)
            except Exception as e:
                logger.exception("Failed processing direct item=%s | event=%s | error: %s", item_name, ename, e)
        

        # --- Indirect items ---
        try:
            indirect_items = await state.item_db.selectIndirectItems(event['direct_items'])
            for row in indirect_items:
                pct_diff = await calculatePctDiff(db, row['item_b'], start_date)
                if pct_diff is None:
                    continue
                level = calculateImpactLevel(pct_diff, directional=False)
                logger.info(
                    "Indirect item — item=%s | event=%s | pct_diff=%.2f%% | level=%s",
                    row['item_b'], ename, pct_diff, level
                )
                if ename not in indirect_impact_dict:
                    indirect_impact_dict[ename] = []
                indirect_impact_dict[ename].append({
                    'event': ename,
                    'item': row['item_b'],
                    'relationship': row['relationship'],
                    'pct_diff': pct_diff,
                    'end_date': end_date,
                })
                event['higherImpact'] = higherImpact(event['higherImpact'], level)
        except Exception as e:
            logger.exception("Failed processing indirect items for event=%s | error: %s", ename, e)

        # --- Write final event impact ---
        try:
            await state.event_db.updateEventImpact(event['higherImpact'], ename)
            if direct_count > 0:
                await sendDiscordMessage(f"[{ename}] {direct_count} direct, {len(indirect_impact_dict.get(ename, []))} indirect items updated | overall: {event['higherImpact']}")
        except Exception as e:
            logger.exception("Failed writing event impact — event=%s | error: %s", ename, e)
            raise

    # --- Persist indirect items ---
    if indirect_impact_dict:
        try:
            await state.event_db.upsertIndirectEventItems(indirect_impact_dict)
        except Exception as e:
            logger.exception("updateIndirectTable failed: %s", e)