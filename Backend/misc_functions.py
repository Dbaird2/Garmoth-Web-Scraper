

async def updateImpactLevel(db):
    """Calculates and persists the worst-case impact level per active event."""
    events = await db.selectAllEvents()
    impact_dict: dict[str, str] = {}
    try:
        for event_name, curr_impact, start_date, end_date, item_name in events:
            price_range = await db.selectWeekBeforePrice(item_name, start_date)
            impact = await calculateImpact(db, price_range, item_name)

            if event_name not in impact_dict:
                impact_dict[event_name] = impact
                continue
            if impact_dict[event_name] == "High":
                continue
            if impact == "Medium":
                impact_dict[event_name] = impact
    except Exception as e:
        print(f"Failed to update impact level: {e}")
    for i, val in enumerate(impact_dict):
        await db.updateEventImpact(impact_dict[val], val)

async def calculateImpact(db, price_range, item):
    """Calculates the impact level of an item based on its pre-event price baseline."""
    try:
        if not price_range:
            return "None"

        baseline_avg = sum(r['price'] for r in price_range) / len(price_range)
        if baseline_avg == 0:
            return "None"

        item_data = await db.selectItemRecentPrice(item)
        print(item_data)
        pct_diff = abs((int(item_data[0]["full_price"]) - baseline_avg) / baseline_avg * 100)

        if pct_diff >= 50:   return "High"
        if pct_diff >= 30:   return "Medium"
        if pct_diff >= 15.5: return "Low"
        return "None"
    except Exception as e:
        print(f"Failed in calculateImpact: {e}")
