import type { ApiPropertyOptions } from '@nestjs/swagger';

export const OPENAPI_CREATE_ORDER = {
  items: {
    description: '주문 품목(메뉴 id, 단가 스냅샷, 수량)',
  } satisfies ApiPropertyOptions,
  item: {
    menuId: { example: 1, minimum: 1 } satisfies ApiPropertyOptions,
    price: { example: 4500, minimum: 0 } satisfies ApiPropertyOptions,
    quantity: {
      example: 2,
      minimum: 1,
      description:
        '주문 수량. 서버는 이 값을 N으로 받으면 `quantity=1` 행을 **N개로 분할** 저장합니다(개별 품목 단위 완료 토글 지원).',
    } satisfies ApiPropertyOptions,
  },
  totalPrice: {
    example: 9000,
    minimum: 0,
    description: '프론트에서 계산한 총액(그대로 저장, 행 합계와 별도)',
  } satisfies ApiPropertyOptions,
  depositorName: {
    example: '홍길동',
    maxLength: 200,
    description: '입금자명 → `Order.customerName`',
  } satisfies ApiPropertyOptions,
  phoneNumber: {
    example: '01012345678',
    maxLength: 32,
    description: '주문자 전화번호 → `Order.phoneNumber`',
  } satisfies ApiPropertyOptions,
} as const;

/** 공개 주문 생성 본문에 추가되는 식별자 (가게/부스/테이블) */
export const OPENAPI_CREATE_PUBLIC_ORDER = {
  storeId: {
    example: 1,
    minimum: 1,
    description:
      '가게(스토어) PK (`Store.id`). **`boothId`와 값이 같아야** 합니다(현재 모델에서 스토어=부스).',
  } satisfies ApiPropertyOptions,
  boothId: {
    example: 1,
    minimum: 1,
    description:
      '부스 PK (`Store.id`). **`storeId`와 동일**해야 합니다. 소켓 룸 `booth:{id}`와 맞추기 위한 값입니다.',
  } satisfies ApiPropertyOptions,
  tableId: {
    example: 5,
    minimum: 1,
    description: '테이블(좌석) id → `Order.tableId`',
  } satisfies ApiPropertyOptions,
} as const;

const OPENAPI_ORDER_MENU_SNAPSHOT: Record<string, unknown> = {
  type: 'object',
  required: ['id', 'name'],
  properties: {
    id: { type: 'integer', example: 1, description: '메뉴 PK' },
    name: { type: 'string', example: '떡볶이', description: '주문 시점 메뉴명(현재 DB 값)' },
  },
};

/** 품목 + 메뉴 이름(조인) */
export const OPENAPI_ORDER_ITEM_WITH_MENU_SCHEMA: Record<string, unknown> = {
  type: 'object',
  required: ['id', 'orderId', 'menuId', 'quantity', 'price', 'completed', 'menu'],
  properties: {
    id: { type: 'integer', example: 1 },
    orderId: { type: 'integer', example: 10 },
    menuId: { type: 'integer', example: 3 },
    quantity: {
      type: 'integer',
      example: 1,
      minimum: 1,
      description:
        '행 분할 저장 도입 이후 신규 주문의 행은 항상 `1`. 분할 이전(레거시) 주문에는 1 이상의 값이 남아 있을 수 있습니다.',
    },
    price: { type: 'integer', example: 4500, minimum: 0, description: '주문 시점 단가 스냅샷' },
    completed: {
      type: 'boolean',
      example: false,
      description: '품목 단위 완료 처리 여부(부스 staff가 토글). 신규 주문 생성 시 항상 `false`.',
    },
    menu: OPENAPI_ORDER_MENU_SNAPSHOT,
  },
};

/** 단일 주문 + 품목(메뉴 이름 포함) */
export const OPENAPI_ORDER_WITH_ITEMS_AND_MENU_SCHEMA: Record<string, unknown> = {
  type: 'object',
  required: [
    'id',
    'storeId',
    'tableId',
    'totalPrice',
    'status',
    'paymentStatus',
    'customerName',
    'phoneNumber',
    'deleted',
    'createdAt',
    'updatedAt',
    'items',
  ],
  properties: {
    id: { type: 'integer', example: 1 },
    storeId: { type: 'integer', example: 1 },
    tableId: { type: 'integer', example: 5 },
    totalPrice: { type: 'integer', example: 9000 },
    status: { type: 'string', example: 'RECEIVED', description: 'OrderStatus' },
    paymentStatus: {
      type: 'string',
      example: 'PENDING',
      description: 'PaymentStatus',
    },
    customerName: {
      type: 'string',
      nullable: true,
      example: '홍길동',
    },
    phoneNumber: {
      type: 'string',
      nullable: true,
      example: '01012345678',
    },
    deleted: {
      type: 'boolean',
      example: false,
      description:
        '소프트 삭제 여부(`PATCH /orders/{id}/toggle-deleted`로 운영자가 토글). `status === CANCELED`와는 별개 개념이며, 신규 주문은 항상 `false`로 생성됩니다.',
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    items: {
      type: 'array',
      items: OPENAPI_ORDER_ITEM_WITH_MENU_SCHEMA,
    },
  },
};

export const OPENAPI_ORDER_LIST_WITH_MENU_RESPONSE_SCHEMA: Record<string, unknown> =
  {
    type: 'array',
    items: OPENAPI_ORDER_WITH_ITEMS_AND_MENU_SCHEMA,
  };
