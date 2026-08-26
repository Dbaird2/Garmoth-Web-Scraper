
from datetime import datetime

import requests
def get_garmoth_events():
    url = "https://garmoth.com/api/trpc/general.getEvents"

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/139.0.0.0 Safari/537.36"
        ),
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://garmoth.com/",
        "Origin": "https://garmoth.com",
        "Content-Type": "application/json",
        "Cookie": "eyJpdiI6IjZlMDlwNk5KYVR4WTNGRW5sWUNZTWc9PSIsInZhbHVlIjoiSDE3ZFR1QUdsczZsTlJ3NjRQWUwrbzZOM081eWUxUmplVnRVNkFuTGM0ZkxhYTZ0V0MydVQ1dVBBcE54TW5wbmpkd0tRVUhLYUw1R092NXdVVldKWnh4WmxpQWlDUGdRQjE3Y1BSL0w0MVM1Z3NqdXc3dXFDMmFYRTVjeG1GUEIiLCJtYWMiOiIxMTZlOGI0ZjcwODJjNjRjZTZlNTljZWViNWQzYjhmNmE2N2U0MzMzNWYzOWJiNmYzMjI1OTZiMDBhMTA4M2JkIiwidGFnIjoiIn0%3D"
    }
    params = {
        "input": '{"region":"na"}'
    }

    import json
    res = requests.get(url, headers=headers, params=params)
    res.raise_for_status()
    json_res = res.json()
    # print(json.dumps(json_res, indent=4))
    events = []
    for event in json_res['result']['data']:
        if event['end_at'] is not None:
            # print(f"Event Name: {event['title']}")
            # print(f"Event Start: {event['created_at']}")
            # print(f"Event End: {event['end_at']}")
            # print(f"Event Type: {event['region']}")
            # print(f"Event Description: {event['img']}")
            # print("--------------------------------------------------")
            date_start = datetime.strptime(event['created_at'], "%Y-%m-%dT%H:%M:%S.%fZ")
            end_date = datetime.strptime(event['end_at'], "%Y-%m-%dT%H:%M:%S.%fZ")
            events.append([event['title'], date_start, end_date])
            # print(f"Event Name: {event['title']}; Event Start: {date_start}; Event End: {end_date}; Event Type: {event['region']}; Event Description: {event['img']}")
    return events