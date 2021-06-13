from database.models import Image
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.auth import get_current_user
from repository import userRepository, networkRepository
from database.schemas import Network, User
from database.connection import get_db

router = APIRouter(
    prefix="/api/users", tags=["users"], responses={404: {"description": "Not found"}})


@router.get("/networks")
async def get_user_networks(user_data: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    networks = await networkRepository.get_all_networks(db)
    if networks is None or len(networks) == 0:
        await networkRepository.create_network(db, title="frcnn-r101",task="detection",known_classes="person,bus,traffic light,book,cat", public_access=True, url="COCO-Detection/faster_rcnn_R_101_FPN_3x.yaml", config_url="COCO-Detection/faster_rcnn_R_101_FPN_3x.yaml")
        await networkRepository.create_network(db, title="maskrcnn-r101",task="segmentation",known_classes="person,bus,traffic light,book,cat", public_access=True, url="COCO-InstanceSegmentation/mask_rcnn_R_101_FPN_3x.yaml", config_url="COCO-InstanceSegmentation/mask_rcnn_R_101_FPN_3x.yaml")
        db.commit()    
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