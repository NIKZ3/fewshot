from pydantic import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    secret_key: str
    token_expire_time: int

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
