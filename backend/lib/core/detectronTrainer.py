import random
import time
from typing import List
import logging
import asyncio

import numpy as np


class DetectronTrainer:
    def __init__(self) -> None:
        self.logger = logging.getLogger('uvicorn.error')

    async def train(self, config_file: str, images: List[np.ndarray], label: str):
        await asyncio.sleep(random.randint(30, 60))
        self.logger.info("FineTuning completed")
