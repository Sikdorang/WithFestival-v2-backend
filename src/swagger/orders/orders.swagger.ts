import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
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
import {
  OPENAPI_ORDER_LIST_WITH_MENU_RESPONSE_SCHEMA,
  OPENAPI_ORDER_WITH_ITEMS_AND_MENU_SCHEMA,
} from './dto.openapi';
import { ORDERS_SWAGGER_TAG } from './tag.constants';

const ORDER_POST_PUBLIC_BODY = {
  schema: {
    type: 'object' as const,
    required: [
      'storeId',
      'boothId',
      'tableId',
      'items',
      'totalPrice',
      'depositorName',
      'phoneNumber',
    ],
    properties: {
      storeId: {
        type: 'integer',
        example: 1,
        minimum: 1,
        description:
          '가게(스토어) PK (`Store.id`). **`boothId`와 같아야** 합니다.',
      },
      boothId: {
        type: 'integer',
        example: 1,
        minimum: 1,
        description:
          '부스 PK (`Store.id`). **`storeId`와 같아야** 합니다.',
      },
      tableId: {
        type: 'integer',
        example: 5,
        minimum: 1,
        description: '테이블(좌석) id → `Order.tableId`',
      },
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
      phoneNumber: {
        type: 'string',
        example: '01012345678',
        maxLength: 32,
        description: '주문자 전화번호 (`Order.phoneNumber`)',
      },
    },
  },
};

/** 스태프용 `GET/PATCH /orders` — Bearer JWT */
export const ApiOrdersStaffControllerDocs = () =>
  composeClass(
    ApiTags(ORDERS_SWAGGER_TAG),
    ApiBearerAuth(SWAGGER_JWT_REF),
  );

/** 공개 `POST /orders` 전용 컨트롤러 클래스 — JWT 없음 */
export const ApiOrdersPublicCreateControllerDocs = () =>
  composeClass(ApiTags(ORDERS_SWAGGER_TAG));

const ORDER_POST_PUBLIC_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '주문 생성(고객·공개)',
      description:
        '**JWT 없음.** `POST /orders`\n\n' +
        '본문에 **`storeId`**, **`boothId`**, **`tableId`**와 품목·총액·입금자명을 둡니다. 현재 DB 모델에서 **스토어=부스**이므로 **`storeId === boothId`**(`Store.id`)여야 하며, 둘이 다르면 **400**입니다.\n\n' +
        '`items`: 메뉴 id·단가(주문 시점 스냅샷)·수량. 각 `menuId`는 해당 스토어의 **활성 메뉴**(`deleted === false`)이어야 합니다.\n\n' +
        '**행 분할 저장 (중요)**: 본문에 `{ menuId: 1, quantity: 2 }` 한 줄을 보내도 서버는 `OrderItem` **`quantity=1` 행 2개**로 분리해 저장합니다. 동일 메뉴를 N개 주문해도 `OrderItem` 행이 N개 생성되어 개별 단위로 `completed` 토글이 가능합니다(`PATCH /orders/items/{itemId}/toggle-completed`). 응답의 `items` 배열은 분할 결과를 그대로 반영합니다.\n\n' +
        '`phoneNumber`는 주문자 전화번호로 `Order.phoneNumber`에 저장합니다.\n\n' +
        '`totalPrice`는 프론트 값을 그대로 저장합니다(행 합계와 검증하지 않음).\n\n' +
        '생성 시 `status`는 **RECEIVED**, `paymentStatus`는 **PENDING**입니다. 응답 품목에는 **`menu.id`·`menu.name`**(현재 DB 기준)이 포함됩니다.',
    }),
    ApiConsumes('application/json'),
    ApiBody(ORDER_POST_PUBLIC_BODY),
    ApiCreatedResponse({
      description: '생성된 Order + items(각 품목에 menu.id, menu.name)',
      schema: OPENAPI_ORDER_WITH_ITEMS_AND_MENU_SCHEMA,
    }),
    ApiBadRequestResponse({
      description:
        'storeId/boothId 불일치, 존재하지 않는 스토어, 잘못된 메뉴 id, 유효성 검사 실패',
    }),
    ApiNotFoundResponse({ description: '본문 `storeId`에 해당하는 스토어 없음' }),
  ],
];

export const ApiOrderCreatePublicDocs = () =>
  composeMethodGroups(ORDER_POST_PUBLIC_DECORATOR_GROUPS);

const ORDER_LIST_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '주문 내역 목록',
      description:
        '**JWT 필수.** `GET /orders?paid=...`. 스토어는 JWT **`sub`(store PK)** 로만 필터합니다.\n\n' +
        '**쿼리 `paid` (필수, boolean)**\n' +
        '- `paid=true` · **`paymentStatus === PAID`** 이면서 **`status`가 `COMPLETED`·`CANCELED`가 아닌** 주문만(입금 확인 후 처리 대기).\n' +
        '- `paid=false` · **`paymentStatus`가 `PAID`가 아니면서 `status`가 `CANCELED`가 아닌** 주문만(예: `PENDING` 입금 대기).\n\n' +
        '응답은 **주문 단위** 배열 + 각 주문의 **`items`**(항목마다 **`menu.name`** 포함). `createdAt` **내림차순**.',
    }),
    ApiQuery({
      name: 'paid',
      required: true,
      type: Boolean,
      example: false,
      description: '`true` | `false` (문자열로 전달)',
    }),
    ApiOkResponse({
      description: 'Order[] — items에 menu.id·menu.name 포함',
      schema: OPENAPI_ORDER_LIST_WITH_MENU_RESPONSE_SCHEMA,
    }),
    ApiBadRequestResponse({
      description: '`paid` 누락 또는 `true`/`false`로 파싱 불가',
    }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];

export const ApiOrderListDocs = () =>
  composeMethodGroups(ORDER_LIST_DECORATOR_GROUPS);

const ORDER_LIST_ALL_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '주문 내역 전체 목록',
      description:
        '**JWT 필수.** `GET /orders/all`. JWT **`sub`(store PK)** 스토어의 **모든 주문**을 반환합니다. `paymentStatus`·`status` 필터 없음. `createdAt` **내림차순**, 각 주문 **`items`**에 **`menu.name`** 포함.\n\n' +
        '특정 구간만 보고 싶다면 기존 `GET /orders?paid=true|false`를 사용하세요.',
    }),
    ApiOkResponse({
      description: 'Order[] — items에 menu.id·menu.name 포함',
      schema: OPENAPI_ORDER_LIST_WITH_MENU_RESPONSE_SCHEMA,
    }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];

export const ApiOrderListAllDocs = () =>
  composeMethodGroups(ORDER_LIST_ALL_DECORATOR_GROUPS);

const ORDER_LIST_CANCELED_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '취소된 주문만 조회',
      description:
        '**JWT 필수.** `GET /orders/canceled`. JWT **`sub`(store PK)** 스토어의 **취소(`status === CANCELED`) 주문**만 반환합니다(`paymentStatus` 무관).\n\n' +
        '`createdAt` **내림차순**, 각 주문 **`items`**에 **`menu.id`·`menu.name`·`completed`** 포함.',
    }),
    ApiOkResponse({
      description: 'Order[] — status가 CANCELED인 주문만, items에 menu 정보 포함',
      schema: OPENAPI_ORDER_LIST_WITH_MENU_RESPONSE_SCHEMA,
    }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];

export const ApiOrderListCanceledDocs = () =>
  composeMethodGroups(ORDER_LIST_CANCELED_DECORATOR_GROUPS);

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
    ApiOkResponse({
      description: '갱신된 Order + items(menu 이름 포함)',
      schema: OPENAPI_ORDER_WITH_ITEMS_AND_MENU_SCHEMA,
    }),
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
    ApiOkResponse({
      description: '갱신된 Order + items(menu 이름 포함)',
      schema: OPENAPI_ORDER_WITH_ITEMS_AND_MENU_SCHEMA,
    }),
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
    ApiOkResponse({
      description: '갱신된 Order + items(menu 이름 포함)',
      schema: OPENAPI_ORDER_WITH_ITEMS_AND_MENU_SCHEMA,
    }),
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
    ApiOkResponse({
      description: '갱신된 Order + items(menu 이름 포함)',
      schema: OPENAPI_ORDER_WITH_ITEMS_AND_MENU_SCHEMA,
    }),
    ApiNotFoundResponse({ description: '해당 주문 없음 또는 다른 스토어 주문' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];

export const ApiOrderStatusCompletedDocs = () =>
  composeMethodGroups(ORDER_PATCH_STATUS_COMPLETED);

const ORDER_ITEM_ID_PARAM = {
  name: 'itemId',
  type: Number,
  example: 7,
  description: '품목 PK (`OrderItem.id`). 소속 주문/스토어는 서버가 조회·검증',
} as const;

const ORDER_ITEM_PATCH_TOGGLE_COMPLETED: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '주문 품목 완료 토글(`OrderItem.completed` 반전)',
      description:
        '**JWT 필수.** `PATCH /orders/items/{itemId}/toggle-completed`. 본문 없음.\n\n' +
        '해당 `itemId`가 속한 주문이 **JWT `sub` 스토어**의 주문이어야 하며, 그렇지 않으면 **404**(타 스토어 정보 누출 방지). `completed`를 현재 값의 **반대**로 갱신합니다(`Order.status`는 변경하지 않음).\n\n' +
        '응답은 갱신된 **Order 전체 + items**(품목마다 `completed`·`menu.name` 포함). 프론트에서 한 번의 호출로 리스트 갱신이 가능합니다.',
    }),
    ApiParam(ORDER_ITEM_ID_PARAM),
    ApiOkResponse({
      description: '갱신된 Order + items(품목마다 completed·menu 이름 포함)',
      schema: OPENAPI_ORDER_WITH_ITEMS_AND_MENU_SCHEMA,
    }),
    ApiNotFoundResponse({
      description: '해당 itemId가 없거나, 다른 스토어 주문의 품목',
    }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];

export const ApiOrderItemToggleCompletedDocs = () =>
  composeMethodGroups(ORDER_ITEM_PATCH_TOGGLE_COMPLETED);
