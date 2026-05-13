import type { ApiPropertyOptions } from '@nestjs/swagger';

export const OPENAPI_CREATE_LOG = {
  identifier: {
    example: 'user-uuid-abc-123',
    maxLength: 191,
    description: '로그를 발생시킨 주체 식별자(임의 문자열, 예: tokenUuid)',
  } satisfies ApiPropertyOptions,
  action: {
    example: 'order.create.click',
    maxLength: 200,
    description: '발생한 행동(자유 문자열)',
  } satisfies ApiPropertyOptions,
  storeId: {
    example: 1,
    minimum: 1,
    description: '로그가 발생한 스토어 PK',
  } satisfies ApiPropertyOptions,
} as const;

export const OPENAPI_LOG_ENTITY_SCHEMA = {
  type: 'object',
  required: ['id', 'identifier', 'action', 'storeId', 'createdAt'],
  properties: {
    id: { type: 'integer', example: 1, description: 'Log PK' },
    identifier: {
      type: 'string',
      example: 'user-uuid-abc-123',
      description: '로그를 발생시킨 주체 식별자',
    },
    action: {
      type: 'string',
      example: 'order.create.click',
      description: '발생한 행동',
    },
    storeId: {
      type: 'integer',
      example: 1,
      description: '로그가 발생한 스토어 PK',
    },
    createdAt: { type: 'string', format: 'date-time' },
  },
} as Record<string, unknown>;
