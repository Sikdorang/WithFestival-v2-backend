import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

/** 모든 Origin(port 포함) 교차 호출 허용. Bearer JWT만 쓰므로 credentials는 꺼 둠(쿠키 없음 → `*` 사용 가능). */
export const APP_CORS_OPTIONS: CorsOptions = {
  origin: '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With',
  ],
  exposedHeaders: ['Content-Disposition'],
  credentials: false,
  optionsSuccessStatus: 204,
  maxAge: 86400,
};

export const SOCKET_IO_CORS = {
  origin: '*',
  credentials: false as const,
};
