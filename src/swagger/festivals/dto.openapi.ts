import type { ApiPropertyOptions } from '@nestjs/swagger';

export const OPENAPI_CREATE_FESTIVAL = {
  university: {
    example: '한국대학교',
    maxLength: 200,
    description: '대학교 이름',
  } satisfies ApiPropertyOptions,
  name: {
    example: '2026 대학 축제',
    maxLength: 200,
    description: '축제 이름',
  } satisfies ApiPropertyOptions,
  startDate: {
    example: '2026-05-10',
    maxLength: 32,
    description: '축제 시작일 문자열',
  } satisfies ApiPropertyOptions,
  endDate: {
    example: '2026-05-12',
    maxLength: 32,
    description: '축제 종료일 문자열',
  } satisfies ApiPropertyOptions,
  location: {
    example: '서울시 ○○대학교 대운동장',
    maxLength: 500,
    description: '개최 위치',
  } satisfies ApiPropertyOptions,
} as const;

export const OPENAPI_UPDATE_FESTIVAL = {
  university: {
    example: '한국대학교',
    maxLength: 200,
  } satisfies ApiPropertyOptions,
  name: {
    example: '2026 봄 축제',
    maxLength: 200,
  } satisfies ApiPropertyOptions,
  startDate: {
    example: '2026-05-10',
    maxLength: 32,
  } satisfies ApiPropertyOptions,
  endDate: {
    example: '2026-05-12',
    maxLength: 32,
  } satisfies ApiPropertyOptions,
  location: {
    example: '캠퍼스 중앙광장 일대',
    maxLength: 500,
  } satisfies ApiPropertyOptions,
} as const;

const OPENAPI_FESTIVAL_PROPERTIES = {
  id: { type: 'string', example: 'clxfestival001' },
  university: { type: 'string', example: '한국대학교' },
  name: { type: 'string', example: '2026 대학 축제' },
  startDate: {
    type: 'string',
    example: '2026-05-10',
  },
  endDate: {
    type: 'string',
    example: '2026-05-12',
  },
  location: {
    type: 'string',
    example: '서울시 ○○대학교 대운동장',
  },
} as Record<string, unknown>;

export const OPENAPI_FESTIVAL_ENTITY_SCHEMA = {
  type: 'object',
  required: [
    'id',
    'university',
    'name',
    'startDate',
    'endDate',
    'location',
  ],
  properties: OPENAPI_FESTIVAL_PROPERTIES,
} as Record<string, unknown>;

export const OPENAPI_FESTIVAL_LIST_SCHEMA = {
  type: 'array',
  items: OPENAPI_FESTIVAL_ENTITY_SCHEMA,
} as Record<string, unknown>;
