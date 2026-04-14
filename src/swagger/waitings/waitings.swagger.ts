import {
  ApiBearerAuth,
  ApiBody,
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
import { type DecoratorArg, composeClass, composeMethodGroups } from '../common/compose';
import { WAITINGS_SWAGGER_TAG } from './tag.constants';

const WAITING_CREATE_BODY = {
  schema: {
    type: 'object' as const,
    required: ['name', 'phoneNumber', 'partySize'],
    properties: {
      name: { type: 'string', example: '홍길동' },
      phoneNumber: { type: 'string', example: '01012345678' },
      partySize: { type: 'integer', example: 4, minimum: 1 },
    },
  },
};

const WAITING_STATUS_PATCH_BODY = {
  schema: {
    type: 'object' as const,
    required: ['status'],
    properties: {
      status: {
        type: 'string',
        enum: ['ENTERED', 'CANCELED'],
        example: 'ENTERED',
        description: 'ENTERED(입장 처리) 또는 CANCELED(취소)',
      },
    },
  },
};

export const ApiWaitingsPublicControllerDocs = () =>
  composeClass(ApiTags(WAITINGS_SWAGGER_TAG));

const WAITING_POST_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '대기 등록(고객)',
      description:
        'JWT 없음. **REST:** `Store` 하위 리소스로 `POST /stores/{storeId}/waitings`. 본문에는 예약자 정보만 둡니다. `status`는 **WAITING**(줄 대기)으로 생성됩니다.',
    }),
    ApiConsumes('application/json'),
    ApiParam({
      name: 'storeId',
      type: Number,
      example: 1,
      description: '스토어 PK (`Store.id`)',
    }),
    ApiBody(WAITING_CREATE_BODY),
    ApiCreatedResponse({ description: '생성된 Waiting' }),
    ApiNotFoundResponse({ description: '`storeId`에 해당하는 스토어 없음' }),
  ],
];

export const ApiWaitingsCreateDocs = () =>
  composeMethodGroups(WAITING_POST_DECORATOR_GROUPS);

export const ApiWaitingsStaffControllerDocs = () =>
  composeClass(
    ApiTags(WAITINGS_SWAGGER_TAG),
    ApiBearerAuth(SWAGGER_JWT_REF),
  );

const WAITING_LIST_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '대기 목록(부스)',
      description:
        '**JWT 필수.** `sub`(store PK)와 일치하는 스토어의 웨이팅만 조회합니다. **ENTERED·CANCELED가 아닌 건만** 반환합니다(현재는 **WAITING**만 해당). `createdAt` 오름차순.',
    }),
    ApiOkResponse({ description: 'Waiting 배열' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];

export const ApiWaitingsListDocs = () =>
  composeMethodGroups(WAITING_LIST_DECORATOR_GROUPS);

const WAITING_PATCH_STATUS_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '대기 상태 변경(부스)',
      description:
        '**JWT 필수.** `sub`(store PK)에 속한 `Waiting`만 수정합니다. `status`는 **ENTERED** 또는 **CANCELED**만 허용됩니다.',
    }),
    ApiConsumes('application/json'),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: 'Waiting PK',
    }),
    ApiBody(WAITING_STATUS_PATCH_BODY),
    ApiOkResponse({ description: '갱신된 Waiting' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
    ApiNotFoundResponse({
      description: '해당 id의 대기가 없거나, JWT 스토어와 `storeId` 불일치',
    }),
  ],
];

export const ApiWaitingStatusPatchDocs = () =>
  composeMethodGroups(WAITING_PATCH_STATUS_DECORATOR_GROUPS);
