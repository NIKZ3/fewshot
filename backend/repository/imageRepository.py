from typing import Optional

from sqlalchemy.orm import Session

from database import models, schemas


async def create_image(db: Session, title: str, url: str, content_type: str, owner_id: int) -> models.Image:
    image: models.Image = models.Image(title=title, url=url,
                                       content_type=content_type, owner_id=owner_id)
    db.add(image)
    return image


async def get_image_by_id(db: Session, id: int) -> models.Image:
    return db.query(models.Image).filter(models.Image.id == id).first()
