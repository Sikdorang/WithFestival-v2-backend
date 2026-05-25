import { Logger, type INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { NextFunction, Request, Response } from 'express';
import {
  SOCKET_SWAGGER_TAG,
  SOCKET_SWAGGER_TAG_DESCRIPTION,
} from '../socket/tag.constants';
import {
  SocketDocsOrderLineItem,
  SocketDocsOrderRealtimePayload,
  SocketDocsReservationCreatedPayload,
  SocketDocsReservationRejectedPayload,
  SocketDocsWaitingCreatedPayload,
  SocketDocsWaitingStatusPayload,
} from '../socket/socket-payload.docs.dto';
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

const SOCKET_SWAGGER_EXTRA_MODELS = [
  SocketDocsOrderLineItem,
  SocketDocsOrderRealtimePayload,
  SocketDocsWaitingCreatedPayload,
  SocketDocsWaitingStatusPayload,
  SocketDocsReservationCreatedPayload,
  SocketDocsReservationRejectedPayload,
] as const;

/**
 * Swagger UI 와 OpenAPI 스펙(JSON/YAML) 모두 보호해야 합니다.
 * `setGlobalPrefix('api')` + `SwaggerModule.setup('docs', ..., useGlobalPrefix: true)`
 * 조합 기준으로 실제 마운트 경로는 다음 셋입니다.
 */
const SWAGGER_PROTECTED_PATHS = [
  '/api/docs',
  '/api/docs-json',
  '/api/docs-yaml',
] as const;

const SWAGGER_REALM = 'WithFestival Swagger';

export function setupSwaggerDocument(app: INestApplication): void {
  installSwaggerBasicAuth(app);

  const steps: Array<(b: DocumentBuilder) => DocumentBuilder> = [
    (b) => b.setTitle(SWAGGER_DOCUMENT_INFO.title),
    (b) => b.setDescription(SWAGGER_DOCUMENT_INFO.description),
    (b) => b.setVersion(SWAGGER_DOCUMENT_INFO.version),
    (b) => b.addBearerAuth(BEARER_OPTIONS, SWAGGER_JWT_REF),
    (b) => b.addTag(SOCKET_SWAGGER_TAG, SOCKET_SWAGGER_TAG_DESCRIPTION),
  ];

  let builder = new DocumentBuilder();
  for (const step of steps) {
    builder = step(builder);
  }

  const config = builder.build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [...SOCKET_SWAGGER_EXTRA_MODELS],
  });
  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
  });
}

/**
 * 환경변수 `SWAGGER_PASSWORD` 가 설정돼 있으면 Swagger 경로(UI/JSON/YAML)에
 * HTTP Basic Auth 미들웨어를 끼웁니다(브라우저 native 로그인 팝업).
 *
 * - **반드시 `SwaggerModule.setup` 호출 이전**에 등록해야 함(라우터 등록 순서상
 *   먼저 등록된 미들웨어가 먼저 매칭됩니다).
 * - 환경변수가 비어 있으면 미들웨어를 끼우지 않고 경고 로그만 남깁니다(로컬 개발
 *   편의). 운영 환경에서는 반드시 값을 설정해야 합니다.
 * - 사용자명은 임의값 허용(빈 값 포함). 비밀번호만 일치하면 통과.
 * - 비교는 타이밍 공격 방어를 위해 상수시간 비교 사용.
 */
function installSwaggerBasicAuth(app: INestApplication): void {
  const logger = new Logger('SwaggerAuth');
  const expected = process.env.SWAGGER_PASSWORD?.trim();

  if (!expected || !expected.length) {
    logger.warn(
      'SWAGGER_PASSWORD env is not set; Swagger UI is publicly accessible. Set the env var to enable Basic Auth.',
    );
    return;
  }

  const middleware = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const header = req.headers.authorization;
    if (typeof header === 'string' && header.startsWith('Basic ')) {
      try {
        const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
        const colonIdx = decoded.indexOf(':');
        const password = colonIdx >= 0 ? decoded.slice(colonIdx + 1) : decoded;
        if (safeEqual(password, expected)) {
          next();
          return;
        }
      } catch {
        // fall through to 401
      }
    }

    res.setHeader(
      'WWW-Authenticate',
      `Basic realm="${SWAGGER_REALM}", charset="UTF-8"`,
    );
    res.status(401).send('Authentication required');
  };

  for (const path of SWAGGER_PROTECTED_PATHS) {
    app.use(path, middleware);
  }
  logger.log(
    `Swagger UI is protected by Basic Auth at: ${SWAGGER_PROTECTED_PATHS.join(', ')}`,
  );
}

/** 길이 차이를 즉시 노출하지 않도록 동일 길이 버퍼끼리 XOR 누적 비교 */
function safeEqual(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const aBuf = Buffer.from(a, 'utf8');
  const bBuf = Buffer.from(b, 'utf8');
  if (aBuf.length !== bBuf.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < aBuf.length; i++) {
    diff |= aBuf[i] ^ bBuf[i];
  }
  return diff === 0;
}
