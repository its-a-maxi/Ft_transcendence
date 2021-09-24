import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import {WsAdapter} from "@nestjs/platform-ws";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Ft_transcendence')

  //app.useWebSocketAdapter(new WsAdapter(app));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))
  
  app.enableCors({
    "origin": "http://localhost:4200",
    "credentials": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    // "preflightContinue": false,
    // "optionsSuccessStatus": 200,
    // "allowedHeaders": 'Content-Type, Authorization',
    
    
  })

  await app.listen(3000);
  logger.log("Server listen on: http://localhost:3000")
}
bootstrap();
