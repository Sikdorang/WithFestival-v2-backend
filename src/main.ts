import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APP_CORS_OPTIONS } from './cors-options';
import { setupSwaggerDocument } from './swagger/common/document.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(APP_CORS_OPTIONS);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  setupSwaggerDocument(app);

  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
