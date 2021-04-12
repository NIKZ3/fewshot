import numpy as np
import cv2
from fastapi import UploadFile, Depends
from sqlalchemy.orm import Session
from typing import Optional, List

from .localStorage import LocalStorageManager
from database.connection import get_db
from repository import imageRepository
from lib.utils.interfaces.fileOps import FileOps

imageStore = LocalStorageManager(type="images")


class ImageOps(FileOps):
    def __init__(self) -> None:
        super().__init__()
        self.storage = LocalStorageManager("images")

    async def decode(self, file: UploadFile):
        contents = await file.read()
        nparr = np.fromstring(contents, np.uint8)
        return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    async def encode(self, image: np.ndarray, content_type: str):
        _, encoded_img = cv2.imencode("."+content_type[6:], image)
        return encoded_img

    async def store_file_and_metadata(self, files: List[UploadFile], owner_id: Optional[int], db: Session = Depends(get_db)):
        content_types = [file.content_type[6:] for file in files]
        location_urls = self.storage.store(files, content_types)
        for index, file in enumerate(files):
            await imageRepository.create_image(
                db, file.filename, location_urls[index], file.content_type[6:], owner_id)
        db.commit()
