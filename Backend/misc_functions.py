# import logging

# logger = logging.getLogger(__name__)

# async def updateImpactLevel(db):
#     """Calculates and persists the worst-case impact level per active event."""
#     events = await db.selectAllEvents()
#     impact_dict: dict[str, int] = {}
#     impact_ints = {'High': 3, 'Medium': 2, 'Low': 1, 'None': 0}
#     try:
#         for event_name, curr_impact, start_date, end_date, item_name, item_impact, item_pct_diff in events:
#             price_range = await db.selectWeekBeforePrice(item_name, start_date)
#             impact = await calculateImpact(db, price_range, item_name, event_name)

#             if event_name not in impact_dict:
#                 impact_dict[event_name] = impact
#                 continue
#             if impact_ints[impact_dict[event_name]] <= impact_ints[impact]:
#                 impact_dict[event_name] = impact
#     except Exception as e:
#         logger.exception("updateImpactLevel failed while iterating events: %s", e)
#     for val in impact_dict:
#         await db.updateEventImpact(impact_dict[val], val)

# async def updateIndirectItemsImpact(db):
#     # 1)
#     logger.info("updateIndirectItemsImpact")
#     events = await db.selectAllEvents()
#     impact_dict: dict[str, str] = {}
#     item_dict: dict[str, str] = {}
#     end_date_dict: dict[str, str] = {}
#     start_date_dict: dict[str, str] = {}

#     # 2)
#     for ename, curr_impact, start_date, end_date, item_name, item_impact, item_pct_diff in events:
#         if not ename in item_dict:
#             item_dict[ename] = [item_name]
#             end_date_dict[ename] = end_date
#             start_date_dict[ename] = start_date
#         else:
#             item_dict[ename].append(item_name)
#     # Get indirect items from each event
#     for ename in item_dict:
#         indirect_items = await db.selectIndirectItems(item_dict[ename])
#         # Iterate through each indirect item
#         for row in indirect_items:
#             price_range = await db.selectWeekBeforePrice(row['name'], start_date_dict[ename])
#             if not price_range:
#                 continue
#             baseline_avg = sum(r['price'] for r in price_range) / len(price_range)
#             if baseline_avg == 0:
#                 continue
#             item_data = await db.selectItemRecentPrice(row['name'])
#             pct_diff = (int(item_data[0]["full_price"]) - baseline_avg) / baseline_avg * 100
#             logger.info(
#                 "updateIndirectItemsImpact — item=%s | event=%s | baseline_avg=%.1f | pct_diff=%.2f%%",
#                 row['name'], ename, baseline_avg, pct_diff
#             )
#             if not ename in impact_dict:
#                 impact_dict[ename] = [{'event': ename, 'item': row['name'], 'pct_diff': pct_diff, 'end_date':end_date_dict[ename]}]
#             else:
#                 impact_dict[ename].append({'event': ename, 'item': row['name'], 'pct_diff': pct_diff, 'end_date':end_date_dict[ename]})
#     await db.updateIndirectTable(impact_dict)

# async def calculateImpact(db, price_range, item, event_name):
#     """Calculates the impact level of an item based on its pre-event price baseline."""
#     try:
#         logger.debug(
#             "calculateImpact started — item=%s | event=%s | price_range_rows=%d",
#             item, event_name, len(price_range) if price_range else 0
#         )
#         if not price_range:
#             return "None"

#         baseline_avg = sum(r['price'] for r in price_range) / len(price_range)
#         if baseline_avg == 0:
#             return "None"

#         item_data = await db.selectItemRecentPrice(item)
#         logger.debug("calculateImpact — recent price fetched for item=%s: %s", item, item_data[0]["full_price"] if item_data else "no data")

#         pct_diff = (int(item_data[0]["full_price"]) - baseline_avg) / baseline_avg * 100
#         logger.info(
#             "calculateImpact — item=%s | event=%s | baseline_avg=%.1f | pct_diff=%.2f%%",
#             item, event_name, baseline_avg, pct_diff
#         )

#         if pct_diff <= -50:   await db.updateEventItem(impact = "High", item = item, event_name = event_name, pct_diff = pct_diff); return "High"
#         if pct_diff <= -30:   await db.updateEventItem(impact = "Medium", item = item, event_name = event_name, pct_diff = pct_diff); return "Medium"
#         if pct_diff <= -15.5: await db.updateEventItem(impact = "Low", item = item, event_name = event_name, pct_diff = pct_diff); return "Low"
#         await db.updateEventItem(impact = "None", item = item, event_name = event_name, pct_diff = pct_diff);
#         return "None"
#     except Exception as e:
#         logger.exception("calculateImpact failed — item=%s | event=%s | error: %s", item, event_name, e)
#         return "None"
import logging

logger = logging.getLogger(__name__)

IMPACT_INTS = {'High': 3, 'Medium': 2, 'Low': 1, 'None': 0}

def get_baseline_avg(price_range) -> float | None:
    """Returns the baseline average price, or None if it can't be computed."""
    if not price_range:
        return None
    avg = sum(r['price'] for r in price_range) / len(price_range)
    return None if avg == 0 else avg

def get_impact_level(pct_diff: float, directional: bool = True) -> str:
    """
    Returns impact level from a pct_diff.
    directional=True  → only negative moves count (direct items, price drops from sale events)
    directional=False → absolute value used (indirect items, can move either way)
    """
    value = pct_diff if directional else abs(pct_diff)
    if value <= -50 or (not directional and value >= 50): return "High"
    if value <= -30 or (not directional and value >= 30): return "Medium"
    if value <= -15.5 or (not directional and value >= 15.5): return "Low"
    return "None"

def worst_impact(a: str, b: str) -> str:
    """Returns whichever impact level is worse."""
    return a if IMPACT_INTS[a] >= IMPACT_INTS[b] else b

async def get_pct_diff(db, item_name: str, start_date) -> float | None:
    """Fetches baseline and recent price for an item, returns pct_diff or None."""
    price_range = await db.selectWeekBeforePrice(item_name, start_date)
    baseline_avg = get_baseline_avg(price_range)
    if baseline_avg is None:
        return None
    item_data = await db.selectItemRecentPrice(item_name)
    if not item_data:
        return None
    return (int(item_data[0]["full_price"]) - baseline_avg) / baseline_avg * 100

async def updateAllImpact(db):
    """
    Single pass over all active events.
    Computes direct + indirect item impact, determines worst-case per event,
    persists item-level records, and writes the final impact to bdo_events.
    """
    events = await db.selectAllEvents()

    # event_name → { start_date, end_date, direct_items, worst_impact }
    event_map: dict[str, dict] = {}

    for ename, curr_impact, start_date, end_date, item_name, item_impact, item_pct_diff in events:
        if ename not in event_map:
            event_map[ename] = {
                'start_date': start_date,
                'end_date': end_date,
                'direct_items': [],
                'worst_impact': 'None',
            }
        event_map[ename]['direct_items'].append(item_name)

    indirect_impact_dict: dict[str, list] = {}

    for ename, event in event_map.items():
        start_date = event['start_date']
        end_date = event['end_date']

        # --- Direct items ---
        for item_name in event['direct_items']:
            try:
                pct_diff = await get_pct_diff(db, item_name, start_date)
                if pct_diff is None:
                    continue
                level = get_impact_level(pct_diff, directional=True)
                logger.info(
                    "Direct item — item=%s | event=%s | pct_diff=%.2f%% | level=%s",
                    item_name, ename, pct_diff, level
                )
                await db.updateEventItem(impact=level, item=item_name, event_name=ename, pct_diff=pct_diff)
                event['worst_impact'] = worst_impact(event['worst_impact'], level)
            except Exception as e:
                logger.exception("Failed processing direct item=%s | event=%s | error: %s", item_name, ename, e)

        # --- Indirect items ---
        try:
            indirect_items = await db.selectIndirectItems(event['direct_items'])
            for row in indirect_items:
                pct_diff = await get_pct_diff(db, row['name'], start_date)
                if pct_diff is None:
                    continue
                level = get_impact_level(pct_diff, directional=False)
                logger.info(
                    "Indirect item — item=%s | event=%s | pct_diff=%.2f%% | level=%s",
                    row['name'], ename, pct_diff, level
                )
                if ename not in indirect_impact_dict:
                    indirect_impact_dict[ename] = []
                indirect_impact_dict[ename].append({
                    'event': ename,
                    'item': row['name'],
                    'pct_diff': pct_diff,
                    'end_date': end_date,
                })
                event['worst_impact'] = worst_impact(event['worst_impact'], level)
        except Exception as e:
            logger.exception("Failed processing indirect items for event=%s | error: %s", ename, e)

        # --- Write final event impact ---
        try:
            await db.updateEventImpact(event['worst_impact'], ename)
        except Exception as e:
            logger.exception("Failed writing event impact — event=%s | error: %s", ename, e)

    # --- Persist indirect items ---
    if indirect_impact_dict:
        try:
            await db.updateIndirectTable(indirect_impact_dict)
        except Exception as e:
            logger.exception("updateIndirectTable failed: %s", e)