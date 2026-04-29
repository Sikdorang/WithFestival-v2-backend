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
