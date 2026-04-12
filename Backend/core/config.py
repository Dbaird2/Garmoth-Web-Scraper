from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    REDIRECT_URI: str
    JWT_SECRET: str

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()