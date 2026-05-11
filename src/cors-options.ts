import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

/** 브라우저 preflight와 인증 헤더 기반 호출을 허용한다. */
export const APP_CORS_OPTIONS: CorsOptions = {
  origin: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With',
  ],
  exposedHeaders: ['Content-Disposition'],
  credentials: true,
  optionsSuccessStatus: 204,
  maxAge: 86400,
};

export const SOCKET_IO_CORS = {
  origin: '*',
  credentials: false as const,
};
