from typing import List, Tuple, Dict
import json

from detectron2 import model_zoo
from detectron2.config import get_cfg, CfgNode
from detectron2.engine import DefaultPredictor

import numpy


class DetectronNetwork:
    def __init__(self, config_file: str = "COCO-Detection/faster_rcnn_R_101_FPN_3x.yaml", threshold: float = 0.75) -> None:
        """
        A class that utilizes detectron2 based neural networks for performing inference on images

        Parameters
        ----------
        config_file : str, optional
            URL of the config file, by default COCO-Detection/faster_rcnn_R_101_FPN_3x.yaml
        threshold : float, optional
            threshold of classification, by default 0.75
        """
        self.cfg: CfgNode = get_cfg()
        self.cfg.merge_from_file(model_zoo.get_config_file(config_file))
        # set threshold for this model
        self.cfg.MODEL.ROI_HEADS.SCORE_THRESH_TEST = threshold
        self.cfg.MODEL.WEIGHTS = model_zoo.get_checkpoint_url(config_file)
        self.predictor = DefaultPredictor(self.cfg)
        with open('lib/coco_mapping.json') as f:
            self.coco_classes: Dict[str, str] = json.load(f)

    def predict(self, image: numpy.ndarray) -> Tuple[dict, List[str], List[float]]:
        """
        Takes in a single image and runs inference on it as per required task and model

        Parameters
        ----------
        image : numpy.ndarray
            3-channel image to be passed through neural net 


        Returns
        -------
        Tuple[numpy.ndarray, List[str], List[float]]
            - outputs dictionary given by model
            - List of detected/segmented classes\n
            - List of confidence scores of the classes\n
        """
        outputs = self.predictor(image)
        class_names: List[str] = self.classIdToNameMapping(
            outputs['instances'].pred_classes)
        return (outputs, class_names, outputs['instances'].scores)

    def classIdToNameMapping(self, class_ids: List[int]) -> List[str]:
        """
        Converts the deteced class names from numerical Ids to string names
        Parameters
        ----------
        class_id : List[int]
            List of Ids representing detected classes

        Returns
        -------
        List[str]
            List of strings representing detected class names
        """
        class_names: List[str] = []
        for id in class_ids:
            key = id.to('cpu').numpy()
            class_names.append(self.coco_classes[str(key+1)])
        return class_names
