import type { ApiPropertyOptions } from '@nestjs/swagger';

export const OPENAPI_CREATE_ORDER = {
  items: {
    description: '주문 품목(메뉴 id, 단가 스냅샷, 수량)',
  } satisfies ApiPropertyOptions,
  item: {
    menuId: { example: 1, minimum: 1 } satisfies ApiPropertyOptions,
    price: { example: 4500, minimum: 0 } satisfies ApiPropertyOptions,
    quantity: { example: 2, minimum: 1 } satisfies ApiPropertyOptions,
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
} as const;
