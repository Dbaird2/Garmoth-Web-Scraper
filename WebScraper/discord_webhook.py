async def sendDiscordMessage(message) -> None:
    import requests
    from dotenv import load_dotenv
    import os

    load_dotenv()

    webhook_url = os.getenv('DISCORD_WEBHOOK')
    message = {"content": message}

    response = requests.post(webhook_url, json=message)
