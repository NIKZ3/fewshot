INSERT INTO networks (title, task, known_classes, public_access, url, config_url)
VALUES 
    ("frcnn-r101","detection", "person,bus,traffic light,book,cat", true, "COCO-Detection/faster_rcnn_R_101_FPN_3x.yaml", "COCO-Detection/faster_rcnn_R_101_FPN_3x.yaml"),
    ("maskrcnn-r101","segmentation", "person,bus,traffic light,book,cat", true, "COCO-InstanceSegmentation/mask_rcnn_R_101_FPN_3x.yaml","COCO-InstanceSegmentation/mask_rcnn_R_101_FPN_3x.yaml")
    