from typing import List, Optional

from pydantic import BaseModel


class Annotation(BaseModel):
    id: int
    title: str
    url: str
    content_type: str
    image_id: int

    class Config:
        orm_mode = True


class Image(BaseModel):
    title: str
    annotations: str
    id: int
    url: str
    content_type: str
    owner_id: int
    annotation: Annotation

    class Config:
        orm_mode = True


class Network(BaseModel):
    title: str
    public_access: bool
    known_class: str
    task: str
    url: str
    id: int
    config_url: str
    owner_id: int

    class Config:
        orm_mode = True


class User(BaseModel):
    id: int
    username: str
    hashed_password: str
    images: List[Image] = []
    networks: List[Network] = []

    class Config:
        orm_mode = True
