import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SWAGGER_JWT_REF } from '../common/constants';
import {
  type DecoratorArg,
  composeClass,
  composeMethodGroups,
} from '../common/compose';
import {
  OPENAPI_COUPON_ENTITY_SCHEMA,
  OPENAPI_COUPON_LIST_RESPONSE_SCHEMA,
  OPENAPI_COUPON_VALIDATE_RESPONSE_SCHEMA,
} from './dto.openapi';
import { COUPONS_SWAGGER_TAG } from './tag.constants';

const COUPON_VALIDATE_BODY = {
  schema: {
    type: 'object' as const,
    required: ['code'],
    properties: {
      code: {
        type: 'string',
        example: 'FEST2026-ABC',
        maxLength: 64,
        description: '쿠폰 번호(앞뒤 공백은 서버에서 trim)',
      },
    },
  },
};

const COUPON_USED_BODY = {
  schema: {
    type: 'object' as const,
    required: ['used'],
    properties: {
      used: {
        type: 'boolean',
        example: true,
        description: '사용 처리 여부',
      },
    },
  },
};

const COUPON_CREATE_BODY = {
  schema: {
    type: 'object' as const,
    required: ['code', 'discountPrice'],
    properties: {
      code: {
        type: 'string',
        example: 'FEST2026-NEW',
        minLength: 1,
        maxLength: 64,
        description: '쿠폰 번호(스토어 내 유일, trim)',
      },
      discountPrice: {
        type: 'integer',
        example: 3000,
        minimum: 0,
        maximum: 2_000_000_000,
        description: '할인 금액(원)',
      },
      holder: {
        type: 'string',
        nullable: true,
        maxLength: 200,
        description: '선택. 소지자(생략·빈 값이면 null)',
      },
    },
  },
};

const COUPON_HOLDER_BODY = {
  schema: {
    type: 'object' as const,
    required: ['holder'],
    properties: {
      holder: {
        type: 'string',
        nullable: true,
        example: '김철수 010-1234-5678',
        maxLength: 200,
        description: '소지자. null·빈 문자열 시 DB null',
      },
    },
  },
};

export const ApiCouponsPublicControllerDocs = () =>
  composeClass(ApiTags(COUPONS_SWAGGER_TAG));

export const ApiCouponsStaffControllerDocs = () =>
  composeClass(
    ApiTags(COUPONS_SWAGGER_TAG),
    ApiBearerAuth(SWAGGER_JWT_REF),
  );

const COUPON_VALIDATE_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '쿠폰 번호 검증(할인액 조회)',
      description:
        '**JWT 불필요.** `POST /stores/{storeId}/coupons/validate`\n\n' +
        '본문 `code`를 trim한 뒤, 해당 스토어의 쿠폰과 **`storeId`+`code` 복합 유일**로 조회합니다. **미사용**(`used === false`)이면 **`valid: true`** 와 **`discountPrice`**(원)를 반환합니다. 번호 불일치·이미 사용·스토어 없음은 모두 **`valid: false`** (스토어가 없으면 **404**). **이 API는 `used`를 변경하지 않습니다.**',
    }),
    ApiParam({
      name: 'storeId',
      type: Number,
      example: 1,
      description: '스토어(부스) PK',
    }),
    ApiConsumes('application/json'),
    ApiBody(COUPON_VALIDATE_BODY),
    ApiOkResponse({
      description: '`valid`; 유효 시 `discountPrice` 포함',
      schema: OPENAPI_COUPON_VALIDATE_RESPONSE_SCHEMA,
    }),
    ApiBadRequestResponse({ description: '본문 검증 실패(빈 code 등)' }),
    ApiNotFoundResponse({ description: '`storeId` 스토어 없음' }),
  ],
];

export const ApiCouponValidateDocs = () =>
  composeMethodGroups(COUPON_VALIDATE_GROUPS);

const COUPON_LIST_STAFF_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '쿠폰 목록(부스)',
      description:
        '**JWT 필수.** `GET /coupons`. `sub`(스토어 PK)에 속한 쿠폰 전부, `id` 오름차순. `holder`·`used` 포함.',
    }),
    ApiOkResponse({
      description: 'Coupon 배열',
      schema: OPENAPI_COUPON_LIST_RESPONSE_SCHEMA,
    }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];

export const ApiCouponListStaffDocs = () =>
  composeMethodGroups(COUPON_LIST_STAFF_GROUPS);

const COUPON_CREATE_STAFF_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '쿠폰 생성(부스)',
      description:
        '**JWT 필수.** `POST /coupons`. `sub` 스토어에 쿠폰을 추가합니다. `code`는 해당 스토어에서 **유일**해야 하며 중복 시 **409**입니다. 생성 시 **`used`는 항상 false**입니다.',
    }),
    ApiConsumes('application/json'),
    ApiBody(COUPON_CREATE_BODY),
    ApiCreatedResponse({
      description: '생성된 Coupon',
      schema: OPENAPI_COUPON_ENTITY_SCHEMA,
    }),
    ApiBadRequestResponse({ description: '유효성 검사 실패' }),
    ApiConflictResponse({ description: '동일 스토어·동일 code 이미 존재' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];

export const ApiCouponCreateStaffDocs = () =>
  composeMethodGroups(COUPON_CREATE_STAFF_GROUPS);

const COUPON_PATCH_USED_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '쿠폰 사용 여부 수정',
      description:
        '**JWT 필수.** `PATCH /coupons/{id}/used`. 본 스토어 쿠폰만. `used`를 갱신한 뒤 전체 레코드를 반환합니다.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: 'Coupon PK',
    }),
    ApiConsumes('application/json'),
    ApiBody(COUPON_USED_BODY),
    ApiOkResponse({
      description: '갱신된 Coupon',
      schema: OPENAPI_COUPON_ENTITY_SCHEMA,
    }),
    ApiBadRequestResponse({ description: '본문 검증 실패' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
    ApiNotFoundResponse({
      description: '해당 `id` 쿠폰이 없거나 다른 스토어 소유',
    }),
  ],
];

export const ApiCouponPatchUsedDocs = () =>
  composeMethodGroups(COUPON_PATCH_USED_GROUPS);

const COUPON_PATCH_HOLDER_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '쿠폰 소지자(holder) 수정',
      description:
        '**JWT 필수.** `PATCH /coupons/{id}/holder`. 본 스토어 쿠폰만. 본문에 **`holder` 필수**(문자열 또는 `null`). 빈 문자열은 null로 저장. `used`는 변경하지 않습니다.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: 'Coupon PK',
    }),
    ApiConsumes('application/json'),
    ApiBody(COUPON_HOLDER_BODY),
    ApiOkResponse({
      description: '갱신된 Coupon',
      schema: OPENAPI_COUPON_ENTITY_SCHEMA,
    }),
    ApiBadRequestResponse({
      description: 'holder 키 누락·형식 오류·200자 초과',
    }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
    ApiNotFoundResponse({
      description: '해당 `id` 쿠폰이 없거나 다른 스토어 소유',
    }),
  ],
];

export const ApiCouponPatchHolderDocs = () =>
  composeMethodGroups(COUPON_PATCH_HOLDER_GROUPS);
