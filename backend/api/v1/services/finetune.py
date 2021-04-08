from typing import List

import numpy as np
from sqlalchemy.orm import Session

from database.models import Network
from database.connection import get_db
from repository import networkRepository
# from lib.core.detectronTrainer import DetectronTrainer


class FineTuner:
    def __init__(self) -> None:
        self.trainer = None  # DetectronTrainer()

    async def tune(
            self,
            images: List[np.ndarray], label: str, network: Network,
            owner_id: int, db: Session
    ):
        # await self.trainer.train(network.config_url, images=images, label=label)
        await networkRepository.create_network(db, network.title+owner_id+label,
                                               known_classes=network.known_classes+","+label, public_access=False, config_url=network.config_url,
                                               task=network.task, owner_id=owner_id)
        db.commit()

    def save_model(self):
        pass
