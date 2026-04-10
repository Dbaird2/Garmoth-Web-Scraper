
async def sendDiscordMessage(message, type = '') -> None:
    import requests
    from dotenv import load_dotenv
    import os

    load_dotenv()
    if type == 'item_drop':
        webhook_url = os.getenv('DISCORD_ITEM_WEBHOOK')
    else:
        webhook_url = os.getenv('DISCORD_WEBHOOK')
    message = {"content": message}

    response = requests.post(webhook_url, json=message)
