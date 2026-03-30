import logging

logger = logging.getLogger(__name__)

async def updateImpactLevel(db):
    """Calculates and persists the worst-case impact level per active event."""
    events = await db.selectAllEvents()
    impact_dict: dict[str, str] = {}
    try:
        for event_name, curr_impact, start_date, end_date, item_name, item_impact, item_pct_diff in events:
            price_range = await db.selectWeekBeforePrice(item_name, start_date)
            impact, pct_diff = await calculateImpact(db, price_range, item_name, event_name)

            if event_name not in impact_dict:
                impact_dict[event_name] = impact
                continue
            if impact_dict[event_name] == "High":
                continue
            if impact != "Medium":
                impact_dict[event_name] = impact
    except Exception as e:
        logger.exception("updateImpactLevel failed while iterating events: %s", e)
    for i, val in enumerate(impact_dict):
        await db.updateEventImpact(impact_dict[val], val, pct_diff)

async def calculateImpact(db, price_range, item, event_name):
    """Calculates the impact level of an item based on its pre-event price baseline."""
    try:
        logger.debug(
            "calculateImpact started — item=%s | event=%s | price_range_rows=%d",
            item, event_name, len(price_range) if price_range else 0
        )
        if not price_range:
            return "None"

        baseline_avg = sum(r['price'] for r in price_range) / len(price_range)
        if baseline_avg == 0:
            return "None"

        item_data = await db.selectItemRecentPrice(item)
        logger.debug("calculateImpact — recent price fetched for item=%s: %s", item, item_data[0]["full_price"] if item_data else "no data")

        pct_diff = (int(item_data[0]["full_price"]) - baseline_avg) / baseline_avg * 100
        logger.info(
            "calculateImpact — item=%s | event=%s | baseline_avg=%.1f | pct_diff=%.2f%%",
            item, event_name, baseline_avg, pct_diff
        )

        if pct_diff <= -50:   await db.updateEventItem(impact = "High", item = item, event_name = event_name, pct_diff = pct_diff); return "High", pct_diff
        if pct_diff <= -30:   await db.updateEventItem(impact = "Medium", item = item, event_name = event_name, pct_diff = pct_diff); return "Medium", pct_diff
        if pct_diff <= -15.5: await db.updateEventItem(impact = "Low", item = item, event_name = event_name, pct_diff = pct_diff); return "Low", pct_diff
        await db.updateEventItem(impact = "None", item = item, event_name = event_name, pct_diff = pct_diff);
        return "None", pct_diff
    except Exception as e:
        logger.exception("calculateImpact failed — item=%s | event=%s | error: %s", item, event_name, e)