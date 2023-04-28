import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YoloController } from './modules/yolo/yolo.controller';
import { YoloService } from './modules/yolo/yolo.service';
import { ConfigModule } from '@nestjs/config';
import { YoloModule } from './modules/yolo/yolo.module';


@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env` }),
    ...(process.env.YOLO_MODEL_PATH ? [YoloModule] : [])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
