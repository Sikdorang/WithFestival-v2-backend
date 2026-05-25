import type { ApiPropertyOptions } from '@nestjs/swagger';
import { Gender } from '../../../generated/prisma/client';

/** `POST /blind-dates` 본문 — `numberDelivered`는 받지 않습니다(서버 기본값 false) */
export const OPENAPI_CREATE_BLIND_DATE = {
  name: {
    example: '홍길동',
    maxLength: 100,
    description: '응모자 본인 이름',
  } satisfies ApiPropertyOptions,
  age: {
    example: 22,
    minimum: 1,
    maximum: 150,
    description: '응모자 나이(만)',
  } satisfies ApiPropertyOptions,
  contact: {
    example: '@hong_gildong',
    maxLength: 200,
    description: '본인 연락처(인스타·카톡 ID 등 자유 텍스트)',
  } satisfies ApiPropertyOptions,
  mbti: {
    example: 'ENFP',
    maxLength: 8,
    description: 'MBTI 16유형(대소문자 무관, 4자리 권장)',
  } satisfies ApiPropertyOptions,
  appearanceStyle: {
    example: 3,
    minimum: 0,
    maximum: 100,
    description: '외모 스타일 코드(운영자가 정의한 정수값, 예: 1~5)',
  } satisfies ApiPropertyOptions,
  gender: {
    enum: Gender,
    enumName: 'Gender',
    example: Gender.MALE,
    description: '성별 — `MALE`(남) | `FEMALE`(녀)',
  } satisfies ApiPropertyOptions,
  deliveryPhone: {
    example: '01012345678',
    maxLength: 32,
    description:
      '매칭 시 상대 번호를 SMS 등으로 전달받을 본인 휴대폰 번호(숫자만 권장)',
  } satisfies ApiPropertyOptions,
} as const;

/**
 * `GET /blind-dates` 본문 — 운영자 인증 비밀번호.
 * 환경변수 `BLIND_DATE_ADMIN_PASSWORD`(미설정 시 소스 기본값) 와
 * 정확히 일치하지 않으면 401.
 */
export const OPENAPI_LIST_BLIND_DATES = {
  password: {
    example: 'ftvww0921@',
    description:
      '운영자 인증 비밀번호. 서버 측 환경변수 값과 정확히 일치해야 함.',
  } satisfies ApiPropertyOptions,
} as const;

/** `BlindDate` 엔티티 응답 스키마 — 생성 응답 등에서 사용 */
export const OPENAPI_BLIND_DATE_ENTITY_SCHEMA: Record<string, unknown> = {
  type: 'object',
  required: [
    'id',
    'name',
    'age',
    'contact',
    'mbti',
    'appearanceStyle',
    'gender',
    'numberDelivered',
    'deliveryPhone',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: { type: 'integer', example: 1 },
    name: { type: 'string', example: '홍길동', maxLength: 100 },
    age: { type: 'integer', example: 22, minimum: 1 },
    contact: { type: 'string', example: '@hong_gildong', maxLength: 200 },
    mbti: { type: 'string', example: 'ENFP', maxLength: 8 },
    appearanceStyle: { type: 'integer', example: 3 },
    gender: {
      type: 'string',
      enum: Object.values(Gender),
      example: Gender.MALE,
      description: '`MALE`(남) | `FEMALE`(녀)',
    },
    numberDelivered: {
      type: 'boolean',
      example: false,
      description:
        '운영자가 해당 응모자에게 매칭 상대 번호를 이미 전달했는지 여부(생성 시 항상 false)',
    },
    deliveryPhone: { type: 'string', example: '01012345678', maxLength: 32 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

/** `BlindDate[]` 목록 응답 스키마 — `GET /blind-dates` (최신순) */
export const OPENAPI_BLIND_DATE_LIST_RESPONSE_SCHEMA: Record<string, unknown> = {
  type: 'array',
  items: OPENAPI_BLIND_DATE_ENTITY_SCHEMA,
};
