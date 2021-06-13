from typing import Optional

from sqlalchemy.orm import Session

from database import models, schemas


async def create_network(db: Session, title: str, known_classes: Optional[str] = [], **kwargs) -> schemas.Network:
    network = models.Network(
        title=title, known_classes=known_classes, **kwargs)
    db.add(network)
    return network


async def get_network_by_id(db: Session, network_id: int):
    return db.query(models.Network).filter(models.Network.id == network_id).first()

async def get_all_networks(db:Session):
    return db.query(models.Network).all()