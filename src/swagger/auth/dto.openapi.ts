import type { ApiPropertyOptions } from '@nestjs/swagger';

export const OPENAPI_LOGIN = {
  authCode: {
    description: '스토어 고유 인증 코드 (Store.authCode)',
    example: 'booth-auth-01',
    maxLength: 64,
  } satisfies ApiPropertyOptions,
} as const;
