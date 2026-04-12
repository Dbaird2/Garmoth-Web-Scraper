import joblib
import pandas as pd
import numpy as np
from pathlib import Path

MODEL_DIR = Path(__file__).resolve().parent

models = {day: joblib.load(MODEL_DIR / f'market_model_{day}d.pkl') for day in range(1, 8)}

def predictItem(item_name, df_latest, day):
    bst = models[day]
    # df_latest is your most recent bdo_items data pulled from the DB
    # it needs to have enough history to compute the lag features (at least 14 days)
    
    item_df = df_latest[df_latest['item'] == item_name].copy()
    item_df = item_df.sort_values('recent_time')
    
    # compute same features as training
    item_df['price_lag_7'] = item_df['price'].shift(7)
    item_df['price_lag_14'] = item_df['price'].shift(14)
    item_df['price_change_7d'] = (item_df['price'] - item_df['price_lag_7']) / item_df['price_lag_7'] * 100
    item_df['price_change_14d'] = (item_df['price'] - item_df['price_lag_14']) / item_df['price_lag_14'] * 100
    item_df['stock_lag_7'] = item_df['stock'].shift(7)
    item_df['price_rolling_7'] = item_df['price'].rolling(7).mean()
    item_df['stock_rolling_7'] = item_df['stock'].rolling(7).mean()
    item_df['recent_time'] = pd.to_datetime(item_df['recent_time'])
    item_df['day_of_month'] = item_df['recent_time'].dt.day
    item_df['month'] = item_df['recent_time'].dt.month
    
    item_df = item_df.replace([np.inf, -np.inf], np.nan)
    item_df = item_df.dropna()
    
    # take only the most recent row for prediction
    latest_row = item_df.iloc[[-1]]
    
    feature_cols = ['stock', 'price_lag_7', 'price_lag_14', 'price_change_7d', 
                    'price_change_14d', 'price_rolling_7', 'stock_rolling_7', 
                    'day_of_month', 'month']
    
    prediction = bst.predict(latest_row[feature_cols])[0]
    return prediction

def predictWeek(item_name, df_latest):
    predictions = {}
    
    for day in range(1, 8):
        pct_change = predictItem(item_name, df_latest, day)
        current_price = df_latest[df_latest['item'] == item_name]['price'].iloc[-1]
        predicted_price = int(current_price * (1 + pct_change / 100))
        predictions[f'day_{day}'] = {
            'pct_change': round(float(pct_change), 2),
            'predicted_price': predicted_price,
        }
    
    return predictions