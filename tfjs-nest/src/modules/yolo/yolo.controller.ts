import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { YoloService } from './yolo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Tensor, NamedTensorMap } from '@tensorflow/tfjs-node';

@Controller('yolo')
export class YoloController {
    constructor(
        private yoloService: YoloService,
    ) {
        this.yoloService.loadModel(`file://${process.env.YOLO_MODEL_PATH}`);
    }

    @Post('inference')
    @UseInterceptors(FileInterceptor('image'))
    public async infer(@UploadedFile() image: any) {
        console.log(image);
        return this.yoloService.predict(image.buffer);
    }
}
