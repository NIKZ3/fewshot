from typing import List
from enum import Enum
import io

from sqlalchemy.orm import Session
from fastapi import APIRouter, UploadFile, File, BackgroundTasks
from fastapi.param_functions import Depends, Form
from fastapi.exceptions import HTTPException
from starlette.responses import StreamingResponse

from api.auth import get_current_user
from api.v1.services.inferenceEngine import InferenceEngine
from database.connection import get_db
from database.models import Network, User
from repository import userRepository, networkRepository
from lib.utils.imageOps import ImageOps

router = APIRouter(prefix="/api/v1/inference", tags=["inference"])
engine = InferenceEngine()
img_util = ImageOps()


class Task(str, Enum):
    detection = "detection"
    segmentation = "segmentation"


@router.post("/{task}")
async def run_inference(
    task: Task,
    background_tasks: BackgroundTasks,
    id: int = Form(...), file: UploadFile = File(...),
    user_data: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    username = user_data['username']
    network: Network = await networkRepository.get_network_by_id(db, network_id=id)
    user: User = await userRepository.get_by_username(db, username)

    if network is None:
        raise HTTPException(
            status_code=400, detail="The requested model is no longer available!")
    if network.owner_id != user.id and not network.public_access:
        raise HTTPException(
            status_code=401, detail="User does not have access to this model")
    if network.task != task:
        raise HTTPException(
            status_code=400, detail=f"You have requested for {task} to be run, but the selected model is for {network.task}!")

    known_classes: List[str] = list(set(network.known_classes.split(",")))
    engine.set_classes(known_classes)

    image = await img_util.decode(file)
    output_image = engine.run(image, task)
    result = await img_util.encode(output_image, file.content_type)

    background_tasks.add_task(
        img_util.store_file_and_metadata, [file], user.id, db)
    return StreamingResponse(io.BytesIO(result.tobytes()), media_type=file.content_type)
