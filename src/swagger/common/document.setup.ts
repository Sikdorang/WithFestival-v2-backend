import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  SWAGGER_DOCUMENT_INFO,
  SWAGGER_JWT_REF,
} from './constants';

const BEARER_OPTIONS = {
  type: 'http' as const,
  scheme: 'bearer',
  bearerFormat: 'JWT',
  in: 'header' as const,
  name: 'Authorization',
};

export function setupSwaggerDocument(app: INestApplication): void {
  const steps: Array<(b: DocumentBuilder) => DocumentBuilder> = [
    (b) => b.setTitle(SWAGGER_DOCUMENT_INFO.title),
    (b) => b.setDescription(SWAGGER_DOCUMENT_INFO.description),
    (b) => b.setVersion(SWAGGER_DOCUMENT_INFO.version),
    (b) => b.addBearerAuth(BEARER_OPTIONS, SWAGGER_JWT_REF),
  ];

  let builder = new DocumentBuilder();
  for (const step of steps) {
    builder = step(builder);
  }

  const config = builder.build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
