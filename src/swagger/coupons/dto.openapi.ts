import type { ApiPropertyOptions } from '@nestjs/swagger';

/** 부스 JWT `POST /coupons` 본문 */
export const OPENAPI_CREATE_COUPON = {
  code: {
    example: 'FEST2026-NEW',
    maxLength: 64,
    description:
      '쿠폰 번호(스토어별 유일). 저장 전 trim 하며 검증합니다.',
  } satisfies ApiPropertyOptions,
  discountPrice: {
    example: 3000,
    minimum: 0,
    maximum: 2_000_000_000,
    description: '할인 금액(원)',
  } satisfies ApiPropertyOptions,
  holder: {
    example: '이영희 010-9999-0000',
    maxLength: 200,
    description: '선택. 쿠폰 소지자(미입력 시 null)',
    nullable: true,
  } satisfies ApiPropertyOptions,
} as const;

export const OPENAPI_VALIDATE_COUPON = {
  code: {
    example: 'FEST2026-ABC',
    description: '쿠폰 번호',
    maxLength: 64,
  } satisfies ApiPropertyOptions,
} as const;

export const OPENAPI_COUPON_VALIDATE_RESPONSE_SCHEMA = {
  type: 'object',
  required: ['valid'],
  properties: {
    valid: {
      type: 'boolean',
      example: true,
      description:
        '`true`: 해당 스토어에 존재하고 아직 미사용(`used === false`)인 쿠폰과 일치',
    },
    discountPrice: {
      type: 'integer',
      minimum: 0,
      example: 2000,
      description: '`valid === true`일 때만 포함. 할인 금액(원)',
    },
  },
} as Record<string, unknown>;

export const OPENAPI_UPDATE_COUPON_USED = {
  used: {
    example: true,
    description: '사용 완료로 표시하면 `true`, 다시 미사용으로 되돌리면 `false`(정책에 맞게 사용)',
  },
} as const;

export const OPENAPI_UPDATE_COUPON_HOLDER = {
  holder: {
    nullable: true,
    example: '김철수 010-1234-5678',
    description:
      '쿠폰을 받은 사람(이름·연락처 등). **필수 키**. `null` 또는 빈 문자열(→null)로 비울 수 있습니다.',
  } satisfies ApiPropertyOptions,
} as const;

const OPENAPI_COUPON_ROW_PROPERTIES: Record<string, unknown> = {
  id: { type: 'integer', example: 1 },
  storeId: { type: 'integer', example: 1 },
  code: { type: 'string', example: 'FEST2026-ABC' },
  discountPrice: { type: 'integer', minimum: 0, example: 2000 },
  used: { type: 'boolean', example: false },
  holder: {
    type: 'string',
    nullable: true,
    example: '김철수 010-1234-5678',
    description: '소지자 표시(없으면 null)',
  },
};

export const OPENAPI_COUPON_ENTITY_SCHEMA = {
  type: 'object',
  required: ['id', 'storeId', 'code', 'discountPrice', 'used', 'holder'],
  properties: OPENAPI_COUPON_ROW_PROPERTIES,
} as Record<string, unknown>;

export const OPENAPI_COUPON_LIST_RESPONSE_SCHEMA = {
  type: 'array',
  items: OPENAPI_COUPON_ENTITY_SCHEMA,
} as Record<string, unknown>;
