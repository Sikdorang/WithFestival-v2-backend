import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { type DecoratorArg, composeClass, composeMethodGroups } from '../common/compose';
import {
  OPENAPI_CREATE_TABLE_LIKE,
  OPENAPI_TABLE_LIKE_CREATED_SCHEMA,
  OPENAPI_MY_TABLE_LIKE_COUNT_SCHEMA,
  OPENAPI_STORE_TABLE_LIKE_LIST_SCHEMA,
} from './dto.openapi';
import { TABLE_LIKES_SWAGGER_TAG } from './tag.constants';

const TABLE_LIKE_ROUTE_PARAMS: DecoratorArg[] = [
  ApiParam({
    name: 'storeId',
    type: Number,
    example: 1,
    description: '스토어 PK (`Store.id`)',
  }),
];

const TABLE_LIKE_CREATE_BODY = {
  schema: {
    type: 'object' as const,
    required: ['nickname', 'storeId', 'tableId'],
    properties: {
      nickname: {
        type: 'string',
        example: OPENAPI_CREATE_TABLE_LIKE.nickname.example,
        maxLength: OPENAPI_CREATE_TABLE_LIKE.nickname.maxLength,
        description: OPENAPI_CREATE_TABLE_LIKE.nickname.description,
      },
      storeId: {
        type: 'integer',
        example: OPENAPI_CREATE_TABLE_LIKE.storeId.example,
        minimum: OPENAPI_CREATE_TABLE_LIKE.storeId.minimum,
        description: OPENAPI_CREATE_TABLE_LIKE.storeId.description,
      },
      tableId: {
        type: 'integer',
        example: OPENAPI_CREATE_TABLE_LIKE.tableId.example,
        minimum: OPENAPI_CREATE_TABLE_LIKE.tableId.minimum,
        description: OPENAPI_CREATE_TABLE_LIKE.tableId.description,
      },
    },
  },
};

export const ApiTableLikesPublicControllerDocs = () =>
  composeClass(ApiTags(TABLE_LIKES_SWAGGER_TAG));

const TABLE_LIKE_NICKNAME_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '테이블 좋아요 닉네임 설정',
      description:
        '**JWT 불필요.** `POST /table-likes/nickname`. 프론트에서 `nickname`, `storeId`, `tableId`를 보내면 백엔드가 `tokenUuid`를 UUID로 생성해 `TableLike` row를 만듭니다. 같은 `storeId`·`tableId`·`nickname` row가 이미 있으면 기존 row를 반환합니다. 이 API는 `likeCount`를 증가시키지 않습니다.',
    }),
    ApiConsumes('application/json'),
    ApiBody(TABLE_LIKE_CREATE_BODY),
    ApiCreatedResponse({
      description: '생성 또는 조회된 TableLike row와 테이블 전체 좋아요 수',
      schema: OPENAPI_TABLE_LIKE_CREATED_SCHEMA,
    }),
    ApiBadRequestResponse({
      description: '본문 검증 실패(nickname/storeId/tableId 누락·형식 오류·길이 초과)',
    }),
    ApiNotFoundResponse({ description: '`storeId`에 해당하는 스토어 없음' }),
  ],
];

export const ApiTableLikeNicknameDocs = () =>
  composeMethodGroups(TABLE_LIKE_NICKNAME_GROUPS);

const TABLE_LIKE_CREATE_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '테이블 좋아요 수 증가',
      description:
        '**JWT 불필요.** `POST /table-likes`. 프론트에서 `nickname`, `storeId`, `tableId`를 보내면 해당 사용자의 `likeCount`를 1 증가시킵니다. row가 없으면 백엔드가 `tokenUuid`를 UUID로 생성해 row를 만들고 `likeCount`를 1로 시작합니다.',
    }),
    ApiConsumes('application/json'),
    ApiBody(TABLE_LIKE_CREATE_BODY),
    ApiCreatedResponse({
      description: '생성된 TableLike row와 테이블 전체 좋아요 수',
      schema: OPENAPI_TABLE_LIKE_CREATED_SCHEMA,
    }),
    ApiBadRequestResponse({
      description: '본문 검증 실패(nickname/storeId/tableId 누락·형식 오류·길이 초과)',
    }),
    ApiNotFoundResponse({ description: '`storeId`에 해당하는 스토어 없음' }),
  ],
];

export const ApiTableLikeCreateDocs = () =>
  composeMethodGroups(TABLE_LIKE_CREATE_GROUPS);

const TABLE_LIKE_STORE_LIST_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '스토어 전체 테이블 좋아요 목록',
      description:
        '**JWT 불필요.** `GET /stores/{storeId}/table-likes`. 해당 스토어의 모든 테이블별로 닉네임과 좋아요 수를 반환합니다.',
    }),
    ...TABLE_LIKE_ROUTE_PARAMS,
    ApiOkResponse({
      description: '테이블별 좋아요 목록',
      schema: OPENAPI_STORE_TABLE_LIKE_LIST_SCHEMA,
    }),
    ApiNotFoundResponse({ description: '`storeId`에 해당하는 스토어 없음' }),
  ],
];

export const ApiTableLikeStoreListDocs = () =>
  composeMethodGroups(TABLE_LIKE_STORE_LIST_GROUPS);

const TABLE_LIKE_MY_COUNT_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '내가 받은 좋아요 수 조회',
      description:
        '**JWT 불필요.** `GET /table-likes/me?tokenUuid=...`. 백엔드가 발급한 UUID 토큰으로 해당 사용자의 좋아요 수를 조회합니다.',
    }),
    ApiQuery({
      name: 'tokenUuid',
      required: true,
      type: String,
      example: '550e8400-e29b-41d4-a716-446655440000',
      description: 'POST /table-likes 응답으로 받은 UUID 토큰',
    }),
    ApiOkResponse({
      description: '내 좋아요 수',
      schema: OPENAPI_MY_TABLE_LIKE_COUNT_SCHEMA,
    }),
    ApiBadRequestResponse({ description: '`tokenUuid` 누락 또는 빈 문자열' }),
    ApiNotFoundResponse({ description: '해당 `tokenUuid`의 TableLike row 없음' }),
  ],
];

export const ApiTableLikeMyCountDocs = () =>
  composeMethodGroups(TABLE_LIKE_MY_COUNT_GROUPS);
