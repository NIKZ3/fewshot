import uuid
import os
from typing import BinaryIO, List
from pathlib import Path

from starlette.datastructures import UploadFile
from lib.utils.interfaces.abstractStorageManager import StorageManager


class LocalStorageManager(StorageManager):
    """
    Implements the StorageManager abstract class, for local file storage
    """

    def __init__(self, type: str = "images") -> None:
        """

        Parameters
        ----------
        type : str, optional
            type of file being stored, can be images, annotation, or serialized models.

            by default "images"
        """
        super().__init__()
        self.location = f"{os.getcwd()}/storage/{type}"
        Path(self.location).mkdir(parents=True,exist_ok=True)

    def store(self, files: List[UploadFile], extensions: List[str]) -> List[str]:
        locations = []
        for file, extension in zip(files, extensions):
            file.file.seek(0)
            content = file.file.read()
            file_location = self.location + "/" + uuid.uuid4().hex + "." + extension
            with open(file_location, "wb+") as f:
                f.write(content)
            file.file.close()
            locations.append(file_location)
        return locations

    def delete(self, url: str):
        os.remove(url)

    def fetch(self, url: str) -> BinaryIO:
        return open(url, "rb+")
