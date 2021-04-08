FROM nvidia/cuda:10.2-runtime
WORKDIR /server
# Install Python and its tools
RUN apt update && apt install git build-essential -y --no-install-recommends \
    python3.8 \
    python3.8-dev \
    python3-pip \
    python3-setuptools \
    ffmpeg libsm6 libxext6
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3.8 0
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.8 0
RUN pip3 -q install pip --upgrade
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN python -m pip install detectron2 -f \
    https://dl.fbaipublicfiles.com/detectron2/wheels/cu102/torch1.7/index.html