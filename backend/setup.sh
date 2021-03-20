echo "Creating Environment ..."
conda env create -f environment.yml -n fewshot
conda activate fewshot
echo "Installing detectron2 ..."
python -m pip install detectron2 -f https://dl.fbaipublicfiles.com/detectron2/wheels/cu110/torch1.7/index.html
