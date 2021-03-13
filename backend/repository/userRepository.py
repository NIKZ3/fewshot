from typing import List

from sqlalchemy.orm import Session

from database import models, schemas


async def create_new_user(db: Session, username: str, hashed_password: str) -> schemas.User:
    user = models.User(username=username, hashed_password=hashed_password)
    db.add(user)
    return user


async def get_by_user_id(db: Session, user_id: int) -> schemas.User:
    return db.query(models.User).filter(
        models.User.id == user_id).first()


async def get_by_username(db: Session, username: str) -> schemas.User:
    return db.query(models.User).filter(
        models.User.username == username).first()


async def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[schemas.User]:
    return db.query(models.User).offset(skip).limit(limit).all()


async def get_networks(db: Session, user_id: int) -> List[schemas.Network]:
    private_networks = db.query(models.Network).filter(
        models.Network.owner_id == user_id).all()
    public_networks = db.query(models.Network).filter(
        models.Network.public_access == True).all()
    return private_networks+public_networks


async def get_images(db: Session, user_id: int) -> List[schemas.Image]:
    return db.query(models.Image).filter(
        models.Image.owner_id == user_id).all()


async def delete_by_username(db: Session, username: str):
    db.query(models.User).filter(
        models.User.username == username).delete()


async def delete_by_user_id(db: Session, user_id: int):
    db.query(models.User).filter(
        models.User.id == user_id).delete()
