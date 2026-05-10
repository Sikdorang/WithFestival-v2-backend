import type { ApiPropertyOptions } from '@nestjs/swagger';

export const OPENAPI_CREATE_FESTIVAL = {
  name: {
    example: '2026 대학 축제',
    maxLength: 200,
    description: '축제 이름',
  } satisfies ApiPropertyOptions,
  location: {
    example: '서울시 ○○대학교 대운동장',
    maxLength: 500,
    description: '개최 위치',
  } satisfies ApiPropertyOptions,
  period: {
    example: '2026.05.10 ~ 05.12',
    maxLength: 200,
    description: '기간(자유 형식 문자열)',
  } satisfies ApiPropertyOptions,
} as const;

export const OPENAPI_UPDATE_FESTIVAL = {
  name: {
    example: '2026 봄 축제',
    maxLength: 200,
  } satisfies ApiPropertyOptions,
  location: {
    example: '캠퍼스 중앙광장 일대',
    maxLength: 500,
  } satisfies ApiPropertyOptions,
  period: {
    example: '5월 10일(금)~12일(일)',
    maxLength: 200,
  } satisfies ApiPropertyOptions,
} as const;

const OPENAPI_FESTIVAL_PROPERTIES = {
  id: { type: 'integer', example: 1 },
  name: { type: 'string', example: '2026 대학 축제' },
  location: {
    type: 'string',
    example: '서울시 ○○대학교 대운동장',
  },
  period: {
    type: 'string',
    example: '2026.05.10 ~ 05.12',
    description: '기간 문자열',
  },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
} as Record<string, unknown>;

export const OPENAPI_FESTIVAL_ENTITY_SCHEMA = {
  type: 'object',
  required: ['id', 'name', 'location', 'period', 'createdAt', 'updatedAt'],
  properties: OPENAPI_FESTIVAL_PROPERTIES,
} as Record<string, unknown>;

export const OPENAPI_FESTIVAL_LIST_SCHEMA = {
  type: 'array',
  items: OPENAPI_FESTIVAL_ENTITY_SCHEMA,
} as Record<string, unknown>;
