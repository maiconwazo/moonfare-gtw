import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1/api');
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`,
  });
  await app.listen(process.env.GATEWAY_PORT);
}
bootstrap();
