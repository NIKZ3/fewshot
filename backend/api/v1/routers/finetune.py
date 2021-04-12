from typing import List, Any

from fastapi import APIRouter, Depends, File, UploadFile, Form, BackgroundTasks
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session

from api.auth import get_current_user
from database.connection import get_db
from database.models import User, Network
from repository import userRepository, networkRepository
from lib.utils.imageOps import ImageOps
from api.v1.services.trainingEngine import TrainingEngine

router = APIRouter(prefix="/api/v1/finetune", tags=["finetune"])
img_util = ImageOps()
tuner = TrainingEngine()


@router.post("/{network_id}")
async def finetune(
    network_id: int,
    background_tasks: BackgroundTasks,
    label: str = Form(...),
    files: List[UploadFile] = File(...),
    user_data: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    username = user_data['username']

    network: Network = await networkRepository.get_network_by_id(db, network_id=network_id)
    user: User = await userRepository.get_by_username(db, username)

    if network is None:
        raise HTTPException(
            status_code=400, detail="The requested model is no longer available!")
    if network.owner_id != user.id and not network.public_access:
        raise HTTPException(
            status_code=401, detail="User does not have access to this model")

    images = []
    for file in files:
        images.append(await img_util.decode(file))

    background_tasks.add_task(
        img_util.store_file_and_metadata, files, user.id, db)
    background_tasks.add_task(tuner.tune, images, label, network, user.id, db)
    return {"message": "New model will be available soon"}
