import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
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
  OPENAPI_FESTIVAL_ENTITY_SCHEMA,
  OPENAPI_FESTIVAL_LIST_SCHEMA,
} from './dto.openapi';
import { FESTIVALS_SWAGGER_TAG } from './tag.constants';

const FESTIVAL_CREATE_BODY = {
  schema: {
    type: 'object' as const,
    required: ['name', 'location', 'period'],
    properties: {
      name: { type: 'string', example: '2026 대학 축제', maxLength: 200 },
      location: {
        type: 'string',
        example: '서울시 ○○대학교 대운동장',
        maxLength: 500,
      },
      period: {
        type: 'string',
        example: '2026.05.10 ~ 05.12',
        maxLength: 200,
      },
    },
  },
};

const FESTIVAL_PATCH_BODY = {
  schema: {
    type: 'object' as const,
    properties: {
      name: { type: 'string', example: '2026 봄 축제', maxLength: 200 },
      location: {
        type: 'string',
        example: '중앙광장 일대',
        maxLength: 500,
      },
      period: {
        type: 'string',
        example: '5월 10일~12일',
        maxLength: 200,
      },
    },
    description:
      '보낸 필드만 갱신합니다. **최소 1개** 필드가 있어야 합니다.',
  },
};

export const ApiFestivalsPublicControllerDocs = () =>
  composeClass(ApiTags(FESTIVALS_SWAGGER_TAG));

export const ApiFestivalsStaffControllerDocs = () =>
  composeClass(
    ApiTags(FESTIVALS_SWAGGER_TAG),
    ApiBearerAuth(SWAGGER_JWT_REF),
  );

const FESTIVAL_LIST_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '축제 목록',
      description:
        '**JWT 불필요.** 등록된 축제 정보를 `id` **내림차순**으로 반환합니다.',
    }),
    ApiOkResponse({
      description: 'Festival 배열',
      schema: OPENAPI_FESTIVAL_LIST_SCHEMA,
    }),
  ],
];

export const ApiFestivalListDocs = () =>
  composeMethodGroups(FESTIVAL_LIST_GROUPS);

const FESTIVAL_GET_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '축제 단건',
      description: '**JWT 불필요.** `Festival.id`로 한 건 조회합니다.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: '축제 PK',
    }),
    ApiOkResponse({
      description: 'Festival',
      schema: OPENAPI_FESTIVAL_ENTITY_SCHEMA,
    }),
    ApiNotFoundResponse({ description: '해당 `id` 없음' }),
  ],
];

export const ApiFestivalGetDocs = () => composeMethodGroups(FESTIVAL_GET_GROUPS);

const FESTIVAL_CREATE_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '축제 생성',
      description:
        '**JWT 필수.** `name`, `location`, `period`로 축제 행사 정보를 추가합니다. (전역 메타데이터이며 **어느 스토어 로그인이든 동일하게 생성 가능**합니다. 운영 정책에 맞게 사용하세요.)',
    }),
    ApiConsumes('application/json'),
    ApiBody(FESTIVAL_CREATE_BODY),
    ApiCreatedResponse({
      description: '생성된 Festival',
      schema: OPENAPI_FESTIVAL_ENTITY_SCHEMA,
    }),
    ApiBadRequestResponse({ description: '유효성 검사 실패' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];

export const ApiFestivalCreateDocs = () =>
  composeMethodGroups(FESTIVAL_CREATE_GROUPS);

const FESTIVAL_UPDATE_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '축제 수정',
      description:
        '**JWT 필수.** `PATCH /festivals/{id}`. `name`·`location`·`period` 중 포함된 필드만 반영합니다. 모두 빼면 **400**.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
    }),
    ApiConsumes('application/json'),
    ApiBody(FESTIVAL_PATCH_BODY),
    ApiOkResponse({
      description: '갱신된 Festival',
      schema: OPENAPI_FESTIVAL_ENTITY_SCHEMA,
    }),
    ApiBadRequestResponse({ description: '반영할 필드 없음' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
    ApiNotFoundResponse({ description: '해당 `id` 없음' }),
  ],
];

export const ApiFestivalUpdateDocs = () =>
  composeMethodGroups(FESTIVAL_UPDATE_GROUPS);

const FESTIVAL_DELETE_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '축제 삭제',
      description:
        '**JWT 필수.** `DELETE /festivals/{id}`. 행 단위 영구 삭제입니다.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
    }),
    ApiNoContentResponse({ description: '삭제 완료' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
    ApiNotFoundResponse({ description: '해당 `id` 없음' }),
  ],
];

export const ApiFestivalDeleteDocs = () =>
  composeMethodGroups(FESTIVAL_DELETE_GROUPS);
