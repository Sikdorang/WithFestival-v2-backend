/** Swagger UI Authorize 스키마 이름 (addBearerAuth 와 동일) */
export const SWAGGER_JWT_REF = 'access-token' as const;

export const SWAGGER_DOCUMENT_INFO = {
  title: 'WithFestival API',
  description:
    '축제 주점 백엔드 — 스토어·인증·메뉴. 실시간 알림은 Swagger 태그 **Socket.IO (실시간)** 를 참고하세요.',
  version: '0.1',
} as const;
