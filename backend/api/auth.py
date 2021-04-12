from typing import Optional
from datetime import datetime, timedelta

from fastapi import Depends
from fastapi.exceptions import HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from config import get_config, Config

oauth_scheme = OAuth2PasswordBearer("/auth/token")


def create_access_token(data: dict, expires_delta: Optional[int] = None):
    config: Config = get_config()
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=config.token_expire_time)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, config.secret_key, algorithm="HS256")
    return encoded_jwt


def get_current_user(token: str = Depends(oauth_scheme), settings: Config = Depends(get_config)):
    try:
        return jwt.decode(token, settings.secret_key, algorithms=['HS256'])
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
