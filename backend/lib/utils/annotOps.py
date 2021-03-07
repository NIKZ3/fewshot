from typing import Any

from sqlalchemy.orm import Session
from fastapi import Depends, UploadFile

from lib.utils.interfaces.fileOps import FileOps
from lib.utils.localStorage import LocalStorageManager
from database.connection import get_db


class AnnotationOps(FileOps):
    def __init__(self) -> None:
        super().__init__()
        self.storageManager = LocalStorageManager(type="annotations")

    def encode(self, data: Any, content_type: str):
        return super().encode(data, content_type)

    def decode(self, file: UploadFile):
        return super().decode(file)

    def store_file_and_metadata(self, file: UploadFile, owner_id: int, db: Session = Depends(get_db)):
        return super().store_file_and_metadata(file, owner_id, db=db)

    def parse(self, annot: dict):
        pass
