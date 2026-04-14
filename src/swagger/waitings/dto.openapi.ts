import type { ApiPropertyOptions } from '@nestjs/swagger';

export const OPENAPI_WAITING_STATUS = {
  enum: ['ENTERED', 'CANCELED'] as const,
  example: 'ENTERED',
} satisfies ApiPropertyOptions;
