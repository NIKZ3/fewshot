from abc import ABC, abstractmethod
from typing import BinaryIO, List

from starlette.datastructures import UploadFile


class StorageManager(ABC):
    def __init__(self) -> None:
        super().__init__()

    @abstractmethod
    def store(self, files: List[UploadFile], extensions: List[str]) -> List[str]:
        """
        Stores file to delegated storage unit and returns url 
        Parameters
        ----------
        files : List[BinaryIO]
            list of files to be stored, read in binary format

        extension : str
            the file extensions, eg, png, jpg, txt
        Returns
        -------
        str
            url of the stored file
        """

    @abstractmethod
    def delete(self, url: str):
        """
        Deletes the given file

        Parameters
        ----------
        url : str
            url of the file to be deleted
        """

    def fetch(self, url: str) -> BinaryIO:
        """
        Retrieve file located at the given url

        Parameters
        ----------
        url : str
            URL of the file to be retrived

        Returns
        -------
        BinaryIO
            The file object, read in binary format
        """
