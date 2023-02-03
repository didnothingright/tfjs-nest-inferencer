# Tensorflowjs Nest Inferencer

This is a simple proof of concept, implementing a REST API with NestJS.
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

POST a form with attribute 'image' to /yolo/inference endpoint. It'll return a object in the following format
```
{
    bbox: number,
    class: number,
    score: number,
}
```


## TODO
- [ ] Implement GPU usage with tfjs-gpu
- [ ] Implement Swagger
- [ ] Plotting images directly on debug
- [ ] Infer videos
