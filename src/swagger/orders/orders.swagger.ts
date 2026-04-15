import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SWAGGER_JWT_REF } from '../common/constants';
import { type DecoratorArg, composeClass, composeMethodGroups } from '../common/compose';
import { ORDERS_SWAGGER_TAG } from './tag.constants';

const ORDER_CREATE_BODY = {
  schema: {
    type: 'object' as const,
    required: ['items', 'totalPrice', 'depositorName'],
    properties: {
      items: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['menuId', 'price', 'quantity'],
          properties: {
            menuId: { type: 'integer', example: 1, minimum: 1 },
            price: { type: 'integer', example: 4500, minimum: 0 },
            quantity: { type: 'integer', example: 2, minimum: 1 },
          },
        },
      },
      totalPrice: {
        type: 'integer',
        example: 9000,
        minimum: 0,
        description:
          '프론트에서 계산한 총액을 그대로 저장합니다(행 단가 스냅샷과 불일치할 수 있음).',
      },
      depositorName: {
        type: 'string',
        example: '홍길동',
        maxLength: 200,
        description: '입금자명 (`Order.customerName`)',
      },
    },
  },
};

export const ApiOrdersControllerDocs = () =>
  composeClass(
    ApiTags(ORDERS_SWAGGER_TAG),
    ApiBearerAuth(SWAGGER_JWT_REF),
  );

const ORDER_POST_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '주문 생성',
      description:
        '**JWT 필수.** `POST /stores/{storeId}/tables/{tableId}/orders`\n\n' +
        '경로의 **`storeId`는 JWT `sub`(store PK)와 반드시 같아야** 합니다(다르면 403).\n\n' +
        '**`tableId`**는 `Order.tableId`에 그대로 저장됩니다.\n\n' +
        '`items`: 메뉴 id·단가(주문 시점 스냅샷)·수량 배열. 각 `menuId`는 **해당 스토어의 활성 메뉴**(`deleted === false`)이어야 합니다.\n\n' +
        '`totalPrice`는 **프론트에서 보낸 값을 그대로** `Order.totalPrice`에 저장합니다(행 합계와 검증하지 않음).\n\n' +
        '생성 시 `status`는 **RECEIVED**(접수), `paymentStatus`는 **PENDING**입니다.',
    }),
    ApiParam({
      name: 'storeId',
      type: Number,
      example: 1,
      description: '스토어 PK (`Store.id`). JWT `sub`와 동일해야 함',
    }),
    ApiParam({
      name: 'tableId',
      type: Number,
      example: 5,
      description: '테이블(좌석) id → `Order.tableId`',
    }),
    ApiConsumes('application/json'),
    ApiBody(ORDER_CREATE_BODY),
    ApiCreatedResponse({ description: '생성된 Order + items' }),
    ApiBadRequestResponse({
      description:
        '존재하지 않거나 다른 스토어/삭제된 메뉴 id, 유효성 검사 실패',
    }),
    ApiForbiddenResponse({
      description: '경로 `storeId`가 JWT 스토어와 불일치',
    }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];

export const ApiOrderCreateDocs = () =>
  composeMethodGroups(ORDER_POST_DECORATOR_GROUPS);

const ORDER_LIST_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '주문 내역 목록',
      description:
        '**JWT 필수.** `GET /orders?paid=...`. 스토어는 JWT **`sub`(store PK)** 로만 필터합니다.\n\n' +
        '**쿼리 `paid` (필수, boolean)**\n' +
        '- `paid=true` · **`paymentStatus === PAID`** 이면서 **`status`가 `COMPLETED`·`CANCELED`가 아닌** 주문만(입금 확인 후 처리 대기).\n' +
        '- `paid=false` · **`paymentStatus`가 `PAID`가 아닌** 주문만(예: `PENDING` 입금 대기).\n\n' +
        '응답은 **주문 단위** 배열 + 각 주문의 **`items`**. `createdAt` **내림차순**.',
    }),
    ApiQuery({
      name: 'paid',
      required: true,
      type: Boolean,
      example: false,
      description: '`true` | `false` (문자열로 전달)',
    }),
    ApiOkResponse({ description: 'Order[] (각 항목에 items 포함)' }),
    ApiBadRequestResponse({
      description: '`paid` 누락 또는 `true`/`false`로 파싱 불가',
    }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];

export const ApiOrderListDocs = () =>
  composeMethodGroups(ORDER_LIST_DECORATOR_GROUPS);

const ORDER_ID_PARAM = {
  name: 'id',
  type: Number,
  example: 1,
  description: '주문 PK (`Order.id`)',
} as const;

const ORDER_PATCH_PAYMENT_PAID: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '결제 상태 → PAID',
      description:
        '**JWT 필수.** `PATCH /orders/{id}/payment/paid`. JWT `sub` 스토어의 주문만 변경합니다. `paymentStatus`를 **PAID**로 둡니다.',
    }),
    ApiParam(ORDER_ID_PARAM),
    ApiOkResponse({ description: '갱신된 Order + items' }),
    ApiNotFoundResponse({ description: '해당 주문 없음 또는 다른 스토어 주문' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];

export const ApiOrderPaymentPaidDocs = () =>
  composeMethodGroups(ORDER_PATCH_PAYMENT_PAID);

const ORDER_PATCH_PAYMENT_FAILED: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '결제 상태 → FAILED',
      description:
        '**JWT 필수.** `PATCH /orders/{id}/payment/failed`. `paymentStatus`를 **FAILED**로 둡니다.',
    }),
    ApiParam(ORDER_ID_PARAM),
    ApiOkResponse({ description: '갱신된 Order + items' }),
    ApiNotFoundResponse({ description: '해당 주문 없음 또는 다른 스토어 주문' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];

export const ApiOrderPaymentFailedDocs = () =>
  composeMethodGroups(ORDER_PATCH_PAYMENT_FAILED);

const ORDER_PATCH_STATUS_CANCELED: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '주문 처리 상태 → CANCELED',
      description:
        '**JWT 필수.** `PATCH /orders/{id}/status/cancelled`. DB enum은 **`CANCELED`**(철자 주의)입니다.',
    }),
    ApiParam(ORDER_ID_PARAM),
    ApiOkResponse({ description: '갱신된 Order + items' }),
    ApiNotFoundResponse({ description: '해당 주문 없음 또는 다른 스토어 주문' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];

export const ApiOrderStatusCanceledDocs = () =>
  composeMethodGroups(ORDER_PATCH_STATUS_CANCELED);

const ORDER_PATCH_STATUS_COMPLETED: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '주문 처리 상태 → COMPLETED',
      description:
        '**JWT 필수.** `PATCH /orders/{id}/status/completed`. `status`를 **COMPLETED**로 둡니다.',
    }),
    ApiParam(ORDER_ID_PARAM),
    ApiOkResponse({ description: '갱신된 Order + items' }),
    ApiNotFoundResponse({ description: '해당 주문 없음 또는 다른 스토어 주문' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];

export const ApiOrderStatusCompletedDocs = () =>
  composeMethodGroups(ORDER_PATCH_STATUS_COMPLETED);
