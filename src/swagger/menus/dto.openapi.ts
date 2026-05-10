import type { ApiPropertyOptions } from '@nestjs/swagger';

export const OPENAPI_CREATE_MENU = {
  name: { example: '떡볶이', maxLength: 200 } satisfies ApiPropertyOptions,
  price: { example: 4500, minimum: 0 } satisfies ApiPropertyOptions,
  marginRate: {
    example: 15,
    minimum: 0,
    maximum: 100,
    description: '마진율(정수 %, 예: 15 = 15%)',
  } satisfies ApiPropertyOptions,
  description: { example: '순한맛', maxLength: 2000 } satisfies ApiPropertyOptions,
} as const;

export const OPENAPI_UPDATE_MENU = {
  name: { example: '떡볶이', maxLength: 200 } satisfies ApiPropertyOptions,
  price: { example: 4500, minimum: 0 } satisfies ApiPropertyOptions,
  marginRate: {
    example: 20,
    minimum: 0,
    maximum: 100,
    description: '마진율(정수 %)',
  } satisfies ApiPropertyOptions,
  description: { example: '순한맛', maxLength: 2000 } satisfies ApiPropertyOptions,
} as const;

const OPENAPI_MENU_PUBLIC_ITEM_PROPERTIES = {
  id: { type: 'integer', example: 1, description: '메뉴 PK' },
  storeId: {
    type: 'integer',
    example: 1,
    description: '스토어(부스) PK',
  },
  name: { type: 'string', example: '떡볶이' },
  price: { type: 'integer', example: 4500, minimum: 0 },
  marginRate: {
    type: 'integer',
    example: 15,
    minimum: 0,
    maximum: 100,
    description: '마진율(%)',
  },
  isSoldOut: {
    type: 'boolean',
    example: false,
    description: '품절이면 true',
  },
  description: {
    type: 'string',
    nullable: true,
    example: '순한맛',
    description: '없으면 null',
  },
  imageUrl: {
    type: 'string',
    nullable: true,
    example: 'https://example.com/menu/1.jpg',
    description: '없으면 null',
  },
} as const;

/** `GET /stores/:storeId/menus` 응답 (항목 스키마) */
export const OPENAPI_MENU_PUBLIC_LIST_RESPONSE_SCHEMA = {
  type: 'array',
  items: {
    type: 'object',
    required: [
      'id',
      'storeId',
      'name',
      'price',
      'marginRate',
      'isSoldOut',
      'description',
      'imageUrl',
    ],
    properties: OPENAPI_MENU_PUBLIC_ITEM_PROPERTIES,
  },
};

const OPENAPI_MENU_STAFF_ITEM_PROPERTIES = {
  id: { type: 'integer', example: 1, description: '메뉴 PK' },
  storeId: {
    type: 'integer',
    example: 1,
    description: '스토어(부스) PK',
  },
  name: { type: 'string', example: '떡볶이' },
  price: { type: 'integer', example: 4500, minimum: 0 },
  marginRate: {
    type: 'integer',
    example: 15,
    minimum: 0,
    maximum: 100,
    description: '마진율(정수 %)',
  },
  isSoldOut: {
    type: 'boolean',
    example: false,
    description: '품절이면 true',
  },
  description: {
    type: 'string',
    nullable: true,
    description: '없으면 null',
  },
  imageUrl: {
    type: 'string',
    nullable: true,
    description: '없으면 null',
  },
  deleted: {
    type: 'boolean',
    example: false,
    description: '목록은 활성만 반환하므로 항상 false',
  },
} as const;

/** `GET /menus` (JWT 스토어) 응답 — Prisma `Menu` 활성 행과 동일 필드 */
export const OPENAPI_MENU_STAFF_LIST_RESPONSE_SCHEMA = {
  type: 'array',
  items: {
    type: 'object',
    required: [
      'id',
      'storeId',
      'name',
      'price',
      'marginRate',
      'isSoldOut',
      'description',
      'imageUrl',
      'deleted',
    ],
    properties: OPENAPI_MENU_STAFF_ITEM_PROPERTIES,
  },
};

/** 생성·수정·품절/판매재개 등 단일 `Menu` 응답 */
export const OPENAPI_MENU_ENTITY_RESPONSE_SCHEMA = {
  type: 'object',
  required: [
    'id',
    'storeId',
    'name',
    'price',
    'marginRate',
    'isSoldOut',
    'description',
    'imageUrl',
    'deleted',
  ],
  properties: OPENAPI_MENU_STAFF_ITEM_PROPERTIES,
};
