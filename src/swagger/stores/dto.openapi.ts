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

export const OPENAPI_UPDATE_STORE_RESERVATION_ENABLED = {
  reservationEnabled: {
    example: true,
    description: '스토어 예약 기능 활성화 여부',
  } satisfies ApiPropertyOptions,
} as const;

export const OPENAPI_UPDATE_STORE_MISSIONS_ENABLED = {
  missionsEnabled: {
    example: true,
    description: '스토어 전체 미션 기능 활성화 여부',
  } satisfies ApiPropertyOptions,
} as const;

/** `GET /stores/:storeId/info` 응답 스키마 */
export const OPENAPI_STORE_PUBLIC_INFO = {
  id: {
    example: 1,
    description: '스토어(부스) PK',
  } satisfies ApiPropertyOptions,
  name: {
    example: '3학년 주점',
    description: '부스(가게) 이름',
    maxLength: 200,
  } satisfies ApiPropertyOptions,
  accountNumber: {
    example: '110-123-456789',
    description: '입금 계좌 안내용 문자열',
    maxLength: 100,
    nullable: true,
  } satisfies ApiPropertyOptions,
  notice: {
    example: '오늘의 추천 메뉴는 …',
    description: '공지',
    maxLength: 2000,
    nullable: true,
  } satisfies ApiPropertyOptions,
  event: {
    example: '첫 주문 10% 할인',
    description: '이벤트 문구',
    maxLength: 500,
    nullable: true,
  } satisfies ApiPropertyOptions,
} as const;

/** Swagger `ApiOkResponse`용 JSON 스키마 (순환 참조 방지) */
export const OPENAPI_STORE_PUBLIC_INFO_RESPONSE_SCHEMA = {
  type: 'object',
  required: ['id', 'name', 'accountNumber', 'notice', 'event'],
  properties: {
    id: { type: 'integer', example: 1, description: '스토어(부스) PK' },
    name: {
      type: 'string',
      example: '3학년 주점',
      description: '부스(가게) 이름',
    },
    accountNumber: {
      type: 'string',
      nullable: true,
      example: '110-123-456789',
      description: '입금 계좌 안내',
    },
    notice: {
      type: 'string',
      nullable: true,
      example: '오늘의 추천 메뉴는 …',
      description: '공지',
    },
    event: {
      type: 'string',
      nullable: true,
      example: '첫 주문 10% 할인',
      description: '이벤트 문구',
    },
  },
};
