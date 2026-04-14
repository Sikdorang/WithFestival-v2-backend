import type { ApiPropertyOptions } from '@nestjs/swagger';

export const OPENAPI_CREATE_MENU = {
  name: { example: '떡볶이', maxLength: 200 } satisfies ApiPropertyOptions,
  price: { example: 4500, minimum: 0 } satisfies ApiPropertyOptions,
  description: { example: '순한맛', maxLength: 2000 } satisfies ApiPropertyOptions,
} as const;
