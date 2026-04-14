import type { ApiPropertyOptions } from '@nestjs/swagger';

export const OPENAPI_CREATE_STORE = {
  name: { example: '3학년 주점', maxLength: 200 } satisfies ApiPropertyOptions,
  accountNumber: {
    example: '110-123-456789',
    maxLength: 100,
  } satisfies ApiPropertyOptions,
  notice: {
    example: '오늘의 추천 메뉴는 …',
    maxLength: 2000,
  } satisfies ApiPropertyOptions,
  event: {
    example: '첫 주문 10% 할인',
    maxLength: 500,
  } satisfies ApiPropertyOptions,
  authCode: {
    description: '부스 인증용 코드 (로그인 시 사용)',
    example: 'booth-secret-01',
    maxLength: 64,
  } satisfies ApiPropertyOptions,
} as const;

export const OPENAPI_UPDATE_STORE_NAME = {
  name: { example: '4학년 주점', maxLength: 200 } satisfies ApiPropertyOptions,
} as const;

export const OPENAPI_UPDATE_STORE_ACCOUNT = {
  accountNumber: {
    example: '110-987-654321',
    maxLength: 100,
  } satisfies ApiPropertyOptions,
} as const;

export const OPENAPI_UPDATE_STORE_NOTICE = {
  notice: {
    example: '영업 시간: 18:00~23:00',
    maxLength: 2000,
  } satisfies ApiPropertyOptions,
} as const;

export const OPENAPI_UPDATE_STORE_EVENT = {
  event: {
    example: '주말 한정 사은품 증정',
    maxLength: 500,
  } satisfies ApiPropertyOptions,
} as const;
