import type { ApiPropertyOptions } from '@nestjs/swagger';

export const OPENAPI_CREATE_MISSION = {
  missionName: {
    example: '인스타그램 스토리 인증',
    maxLength: 200,
  } satisfies ApiPropertyOptions,
  description: {
    example: '스토어 태그 후 인증하면 보상 제공',
    maxLength: 2000,
  } satisfies ApiPropertyOptions,
  reward: {
    example: '음료 1잔 무료',
    maxLength: 500,
  } satisfies ApiPropertyOptions,
} as const;

export const OPENAPI_UPDATE_MISSION = {
  missionName: {
    example: '친구 태그 인증',
    maxLength: 200,
  } satisfies ApiPropertyOptions,
  description: {
    example: '친구를 태그하고 스토리 업로드',
    maxLength: 2000,
  } satisfies ApiPropertyOptions,
  reward: {
    example: '사이드 메뉴 무료',
    maxLength: 500,
  } satisfies ApiPropertyOptions,
} as const;

export const OPENAPI_UPDATE_MISSION_ACTIVE = {
  isActive: {
    example: true,
    description: '미션 활성화 여부 토글 값',
  } satisfies ApiPropertyOptions,
} as const;

const OPENAPI_MISSION_ROW_PROPERTIES: Record<string, unknown> = {
  id: { type: 'integer', example: 1 },
  storeId: { type: 'integer', example: 1 },
  missionName: { type: 'string', example: '인스타그램 스토리 인증' },
  description: {
    type: 'string',
    nullable: true,
    example: '스토어 태그 후 인증',
  },
  reward: { type: 'string', example: '음료 1잔 무료' },
  isActive: { type: 'boolean', example: true },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};

/** 고객용 목록 항목(활성 미션만, `missionsEnabled` 반영 후) */
export const OPENAPI_MISSION_PUBLIC_LIST_SCHEMA = {
  type: 'array',
  items: {
    type: 'object',
    required: [
      'id',
      'storeId',
      'missionName',
      'description',
      'reward',
      'isActive',
      'createdAt',
      'updatedAt',
    ],
    properties: OPENAPI_MISSION_ROW_PROPERTIES,
  },
} as Record<string, unknown>;
