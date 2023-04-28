import { Module } from '@nestjs/common';
import { YoloController } from './yolo.controller';
import { YoloService } from './yolo.service';

@Module({
  controllers: [YoloController],
  providers: [YoloService],
})
export class YoloModule {

}
