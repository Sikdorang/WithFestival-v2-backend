import type { ApiPropertyOptions } from '@nestjs/swagger';

export const OPENAPI_CREATE_MENU = {
  name: { example: '떡볶이', maxLength: 200 } satisfies ApiPropertyOptions,
  price: { example: 4500, minimum: 0 } satisfies ApiPropertyOptions,
  description: { example: '순한맛', maxLength: 2000 } satisfies ApiPropertyOptions,
} as const;

export const OPENAPI_UPDATE_MENU = {
  name: { example: '떡볶이', maxLength: 200 } satisfies ApiPropertyOptions,
  price: { example: 4500, minimum: 0 } satisfies ApiPropertyOptions,
  description: { example: '순한맛', maxLength: 2000 } satisfies ApiPropertyOptions,
} as const;

/** `GET /stores/:storeId/menus` 응답 (항목 스키마) */
export const OPENAPI_MENU_PUBLIC_LIST_RESPONSE_SCHEMA = {
  type: 'array',
  items: {
    type: 'object',
    required: ['id', 'storeId', 'name', 'price', 'description', 'imageUrl'],
    properties: {
      id: { type: 'integer', example: 1, description: '메뉴 PK' },
      storeId: {
        type: 'integer',
        example: 1,
        description: '스토어(부스) PK',
      },
      name: { type: 'string', example: '떡볶이' },
      price: { type: 'integer', example: 4500, minimum: 0 },
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
    },
  },
};
