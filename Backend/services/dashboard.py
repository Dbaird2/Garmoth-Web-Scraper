from fastapi import HTTPException
from state import db, logger

async def fetchAllItems():
    try:
        items = await db.selectAllItemRows()
        if items == "Items Not Found":
            raise HTTPException(status_code=404, detail="Items not found")
        item_list = []
        for item in items:
            item_list.append({'id': item[0], 'name': item[1], 'percentage': item[2], 'stock': item[3], 'price': float(item[4]), 'percent_diff': item[5] if item[5] is not None else 0, 'price_diff': item[6] if item[6] is not None else 0, 'category': item[7] if item[7] is not None else ''})
        return item_list
    except Exception as e:
        logger.exception("fetchAllItems failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


async def getIndirectItems():
    indirect_items = await db.selectActiveIndirectItems()
    events = await db.selectAllEvents()
    event_dict = {}
    item_dict = {}
    json_indirect = {}
    seen_direct = set()
    for row in events:
        event = row[0]
        impact = row[1]
        start_date = row[2].strftime('%Y-%m-%d')
        end_date = row[3].strftime('%Y-%m-%d')            
        seen_direct.add((event, row[4]))
        if event not in item_dict:
            item_dict[event] = [{'name': row[4], 'impact': row[5], 'pct_diff': row[6]}]
        else:
            item_dict[event].append({'name': row[4], 'impact': row[5], 'pct_diff': row[6]})
        event_dict[event] = {
            "event": event,
            "impact": impact,
            "start_date": start_date,
            "end_date": end_date,
            "direct_items": {
                "items": sorted(item_dict[event], key=lambda x: (x['pct_diff'], x['name']))},
            "indirect_items": {
                "items": []
            }

        }
    # Build indirect lookup
    for row in indirect_items:
        event = row[1]
        item = row[2]
        pct_diff = row[3]
        end_date = row[4].isoformat()  # fix date serialization
        if event not in json_indirect:
            json_indirect[event] = []
        if (event, item) not in seen_direct:
            json_indirect[event].append({'event': event, 'item': item, 'pct_diff': pct_diff, 'end_date': end_date})
    # Merge indirect into event_dict
    for event, indirect_rows in json_indirect.items():
        if event in event_dict:
            event_dict[event]["indirect_items"] = {
                "items": sorted(indirect_rows, key=lambda x: (x['pct_diff'], x['item']))
            }
    return event_dict       


def calculateImpact(buy, current):
    percentage = abs(((current - buy) / buy) * 100)
    if percentage >= 200:
        return "Very High"
    elif percentage >= 100:
        return "High"
    elif percentage >= 50:
        return "Medium"
    elif percentage >= 15.5:
        return "Low"
    else:
        return "None" 