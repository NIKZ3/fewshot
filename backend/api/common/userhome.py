from database.models import Image
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.auth import get_current_user
from repository import userRepository
from database.schemas import Network, User
from database.connection import get_db

router = APIRouter(
    prefix="/api/users", tags=["users"], responses={404: {"description": "Not found"}})


@router.get("/networks")
async def get_user_networks(user_data: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    username: str = user_data["username"]
    user: User = await userRepository.get_by_username(db, username=username)
    networks: List[Network] = await userRepository.get_networks(db, user.id)
    return networks


@router.get("/images")
async def get_user_images(user_data: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    username: str = user_data["username"]
    user: User = await userRepository.get_by_username(db, username=username)
    images: List[Image] = await userRepository.get_images(db, user.id)
    return images

# TODO: make an API to return the actual image instead of image DB object
