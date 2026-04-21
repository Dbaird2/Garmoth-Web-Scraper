import httpx, jwt, os
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.responses import RedirectResponse
import state
import logging 

logger = logging.getLogger(__name__)

router = APIRouter(tags=["auth"])

bearer = HTTPBearer()
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")
JWT_SECRET = os.getenv("JWT_SECRET")

@router.get("/auth/google/login")
def googleLogin():
    url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        "&response_type=code"
        "&scope=openid email profile"
    )
    return RedirectResponse(url)

@router.get("/auth/google/callback")
async def googleCallback(code: str):
    async with httpx.AsyncClient() as client:
        # Exchange code for token
        token_res = await client.post("https://oauth2.googleapis.com/token", data={
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": REDIRECT_URI,
            "grant_type": "authorization_code",
        })
        token_data = token_res.json()

        # Get user info
        user_res = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {token_data['access_token']}"}
        )
        user = user_res.json()  # { email, name, picture }

    # Upsert user in your DB here
    await state.db.upsertUser(user['email'], user['name'])

    # Issue your own JWT
    payload = {
        "sub": user["email"],
        "name": user["name"],
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

    # Redirect to frontend with token
    return RedirectResponse(f"https://bdo-event-tracker.vercel.app/auth?token={token}")

def getCurrentUser(credentials: HTTPAuthorizationCredentials = Security(bearer)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def checkJWT(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("JWT token expired")
        return None
    except jwt.InvalidTokenError:
        logger.warning("Invalid JWT token")
        return None