from pydantic import BaseSettings
from functools import lru_cache


class Config(BaseSettings):
    secret_key: str
    token_expire_time: int
    detection_default_config: str
    segmentation_default_config: str

    class Config:
        env_file = ".env"


@lru_cache()
def get_config() -> Config:
    return Config()
