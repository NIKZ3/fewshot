from typing import List

import numpy
from fastapi import Depends

from lib.core.detectronNetwork import DetectronNetwork
from lib.utils.visualizer import ImageVisualizer
from config import get_config, Config


class InferenceEngine:
    def __init__(self) -> None:
        self.known_classes = ['person', 'bus', 'traffic light', 'book', 'cat']
        self.config: Config = get_config()
        print("Loading Inference Engine...")
        self.detectionNet = DetectronNetwork(
            config_file=self.config.detection_default_config, threshold=0.8)
        self.segmentationNet = DetectronNetwork(
            config_file=self.config.segmentation_default_config, threshold=0.8)
        print("Inference Engine Ready!")

    def run(self, image: numpy.ndarray, task: str):
        if task == "detection":
            outputs, class_names, _ = self.detectionNet.predict(
                image=image)
            visualizer = ImageVisualizer(
                config_file=self.config.detection_default_config)
        elif task == "segmentation":
            outputs, class_names, _ = self.segmentationNet.predict(
                image=image)
            visualizer = ImageVisualizer(
                config_file=self.config.segmentation_default_config)

        return visualizer.generate_image(
            image, outputs, class_names, self.known_classes)

    def set_classes(self, new_classes: List[str]):
        self.known_classes = new_classes

    def load_model(self, config_file: str, task: str):
        if task == "detection":
            self.detectionNet = DetectronNetwork(
                config_file=config_file, threshold=0.8)
        elif task == "segmentation":
            self.segmentationNet = DetectronNetwork(
                config_file=config_file, threshold=0.8)
