from typing import List, Dict

import torch
import numpy as np
from detectron2.utils.visualizer import Visualizer
from detectron2.structures.instances import Instances
from detectron2.structures.boxes import Boxes
from detectron2.data import MetadataCatalog

from detectron2 import model_zoo
from detectron2.config import get_cfg, CfgNode


class ImageVisualizer:
    def __init__(self, config_file: str) -> None:
        self.cfg: CfgNode = get_cfg()
        self.cfg.merge_from_file(model_zoo.get_config_file(config_file))

    def generate_instance(self, instance: Instances, class_names: List[str], total_classes: List[str]):
        instance = instance.to('cpu')
        boxes = instance.pred_boxes.tensor.numpy()
        masks = None
        scores = instance.scores.numpy()

        if instance.has("pred_masks"):
            masks = instance.pred_masks.numpy()
        for index, name in enumerate(class_names):
            if name not in total_classes:
                boxes[index:index+1] = 0
                scores[index] = 0
                if masks is not None:
                    masks[index:index+1] = False

        instance.pred_boxes = Boxes(torch.from_numpy(boxes))
        if masks is not None:
            instance.pred_masks = torch.from_numpy(masks)
        instance.scores = torch.from_numpy(scores)
        return instance

    def generate_image(self,
                       image: np.ndarray,
                       outputs: Dict[str, Instances],
                       class_names: List[str],
                       total_classes: List[str]) -> np.ndarray:
        instance: Instances = self.generate_instance(
            instance=outputs['instances'], class_names=class_names, total_classes=total_classes)
        v = Visualizer(image[:, :, ::-1],
                       MetadataCatalog.get(self.cfg.DATASETS.TRAIN[0]), scale=1.2)
        out = v.draw_instance_predictions(instance)
        return out.get_image()[:, :, ::-1]
