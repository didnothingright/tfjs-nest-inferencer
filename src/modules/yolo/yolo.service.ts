import { Injectable, Logger } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';
import { convertYolo } from 'src/helpers/convert-yolo.helper';

@Injectable()
export class YoloService {
    private model: tf.GraphModel;
    private logger = new Logger(YoloService.name);
    constructor() {}

    public async predict(image: any) {
        const tensor = tf.node.decodeImage(image);
        const [width, height] = this.model.inputs[0].shape.slice(1, 3);
        const img = tf.tidy(() => {
            return tf.image.resizeBilinear(tensor, [width, height]).div(255.0).expandDims(0);
        });

        const predictions = await this.preprocess(img);
        tf.dispose();
        return predictions;
   
    }

    public async loadModel(path: string) {
        this.model = await tf.loadGraphModel(path);
        const dummyInput = tf.ones(this.model.inputs[0].shape);
        const warmupResult = await this.model.executeAsync(dummyInput);
        tf.dispose(warmupResult); 
        tf.dispose(dummyInput);
    }

    private async preprocess(tensor: tf.Tensor) {
        const result: tf.Tensor[] = await this.model.executeAsync(tensor) as tf.Tensor[];
        const [boxes, scores, classes] = result.slice(0, 3);
        const predictions = convertYolo(
            boxes.dataSync(),
            scores.dataSync(),
            classes.dataSync()
        );
        this.logger.log(predictions);
        return predictions;
    }

}
