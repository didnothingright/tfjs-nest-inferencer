# Tensorflowjs Nest Inferencer

This is a simple example of a proof of concept, implementing a REST API with NestJS.
At the moment only YOLO prediction is supported. 

## Installation

Run
```
yarn 
yarn build && yarn start
```

## Setting up a YOLO model
If you wish to run a yolo model, convert it to json using the official script from yolov5, like bellow
```
git clone https://github.com/ultralytics/yolov5.git
python export.py --weights yolov5s.pt --include tfjs
```

This will create a web_model folder. Save it on this repository and change the .env file poiting YOLO_MODEL_PATH to its respective absolute path for model.json file.

## TODO
- [ ] Plotting images directly on debug
- [ ] Infer videos