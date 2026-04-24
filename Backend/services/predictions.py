from predict_item import predictWeek
import state
import pandas as pd
from services.events import calculateImpact
import json
import logging

logger = logging.getLogger(__name__)

async def getPredictedPrice(item_name):
    df_latest = await state.item_db.getRecentPriceHistory(item_name, days=30)
    df_latest = pd.DataFrame(df_latest, columns=['recent_time', 'percentage', 'item', 'stock', 'price'])
    predictions = predictWeek(item_name, df_latest)
    # Insert Into DB & Redis Cache here with an expiration time of 24 hours
    await state.invest_db.upsertPredictedPrices(item_name, predictions)
    await state.cache.set(f"predicted_price:{item_name}", json.dumps(predictions), ex=3600)  # Cache for 1 hour
    return predictions

async def getFormattedInvestmentData(email):
    from datetime import date, timedelta
    formatted_investments = {
        'positions': [],
        'chart_data': {}
    }
    predictions = {}

    user_investments = await state.invest_db.getInvestments(email)
    for investment in user_investments:
        formatted_investments['positions'].append({
            'id': investment[1],
            'item': investment[0],
            'qty': investment[2] - (investment[7] or 0),
            'buyPrice': investment[3],
            'impact': calculateImpact(investment[3], investment[5]),
            'pnl': ((investment[5] - investment[3]) / investment[3]) * 100,
            'currentPrice': investment[5],
            'recent_time': investment[6].isoformat() if investment[6] else None,
            'sold_qty': investment[7]
            })
    chart_data = await state.invest_db.getChartInvestmentData(email)
    formatted_investments['chart_data'] = {}
    unique_items = {row[3] for row in chart_data}
    for item in unique_items:
        item_predictions = await state.cache.get(f"predicted_price:{item}")
        # Get predictions for the item if not already fetched (with caching)
        if item_predictions:
            predictions[item] = json.loads(item_predictions) 
        else:
            predictions[item] = await getPredictedPrice(item)

    for row in chart_data:
        item = row[3]
        if item not in formatted_investments['chart_data']:
            formatted_investments['chart_data'][item] = []  # initialize first
        formatted_investments['chart_data'][item].append({'date': row[1].isoformat(),'actual': row[5],'projected': None})


    today = date.today()

    for item_name, week_dict in predictions.items():
        for day_num in range(1, 8):
            day_key = f"day_{day_num}"
            if day_key not in week_dict:
                continue
                
            pred = week_dict[day_key]
            future_date = today + timedelta(days=day_num)
            
            formatted_investments['chart_data'][item_name].append({
                'date': future_date.isoformat(),
                'actual': None,
                'projected': pred['predicted_price']
            })

    return formatted_investments