import type { ApiPropertyOptions } from '@nestjs/swagger';

export const OPENAPI_WAITING_STATUS_PATCH = {
  enum: ['ENTERED', 'CANCELED'] as const,
  example: 'ENTERED',
} satisfies ApiPropertyOptions;
