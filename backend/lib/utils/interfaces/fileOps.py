from abc import ABC, abstractmethod
from typing import Any, Optional

from sqlalchemy.orm import Session
from database.connection import get_db
from fastapi import UploadFile, Depends


class FileOps(ABC):
    def __init__(self) -> None:
        super().__init__()

    async def encode(self, data: Any, content_type: str):
        """
        Encode raw file data into format that can be sent back in HTTP response
        Parameters
        ----------
        data : Any
            raw data of the file.

            May be in string format for text files, or np.array for images
        content_type : str
            content_type of file, eg. jpg, png, txt
        """
        pass

    async def decode(self, file: UploadFile):
        """
        Decode data received in HTTP request, bring in format that can be used by application code
        Parameters
        ----------
        file : UploadFile
            UploadFile object sent in request
        """
        pass

    async def store_file_and_metadata(self, file: UploadFile, owner_id: Optional[int], db: Session = Depends(get_db)):
        """
        Store file in required storage medium and make a corrosponding entry in the db
        Parameters
        ----------
        file : UploadFile
            [description]
        owner_id : Optional[int]
            [description]
        db : Session, optional
            [description], by default Depends(get_db)
        """
        pass
