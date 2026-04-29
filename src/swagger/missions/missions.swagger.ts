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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SWAGGER_JWT_REF } from '../common/constants';
import { type DecoratorArg, composeClass, composeMethodGroups } from '../common/compose';
import { MISSIONS_SWAGGER_TAG } from './tag.constants';

const MISSION_CREATE_BODY = {
  schema: {
    type: 'object' as const,
    required: ['missionName', 'reward'],
    properties: {
      missionName: { type: 'string', example: '인스타그램 스토리 인증', maxLength: 200 },
      description: { type: 'string', example: '스토어 태그 후 인증하면 보상 제공' },
      reward: { type: 'string', example: '음료 1잔 무료', maxLength: 500 },
    },
  },
};

const MISSION_UPDATE_BODY = {
  schema: {
    type: 'object' as const,
    properties: {
      missionName: { type: 'string', example: '친구 태그 인증', maxLength: 200 },
      description: { type: 'string', example: '친구를 태그하고 스토리 업로드' },
      reward: { type: 'string', example: '사이드 메뉴 무료', maxLength: 500 },
    },
  },
};

const MISSION_ACTIVE_BODY = {
  schema: {
    type: 'object' as const,
    required: ['isActive'],
    properties: {
      isActive: { type: 'boolean', example: true, description: '미션 활성화 여부' },
    },
  },
};

const MISSION_ID_PARAM = {
  name: 'id',
  type: Number,
  example: 1,
  description: '미션 PK (`Mission.id`)',
} as const;

export const ApiMissionsControllerDocs = () =>
  composeClass(ApiTags(MISSIONS_SWAGGER_TAG), ApiBearerAuth(SWAGGER_JWT_REF));

const MISSION_CREATE_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '미션 생성(부스)',
      description: '**JWT 필수.** 로그인한 스토어(`JWT sub`)에 미션을 생성합니다.',
    }),
    ApiConsumes('application/json'),
    ApiBody(MISSION_CREATE_BODY),
    ApiCreatedResponse({ description: '생성된 Mission' }),
    ApiBadRequestResponse({ description: '유효성 검사 실패' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];
export const ApiMissionCreateDocs = () => composeMethodGroups(MISSION_CREATE_GROUPS);

const MISSIONS_LIST_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '미션 목록(부스)',
      description: '**JWT 필수.** 로그인한 스토어(`JWT sub`)의 미션 목록을 조회합니다.',
    }),
    ApiOkResponse({ description: 'Mission 배열' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];
export const ApiMissionsListDocs = () => composeMethodGroups(MISSIONS_LIST_GROUPS);

const MISSION_GET_ONE_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '미션 단건 조회(부스)',
      description: '**JWT 필수.** 로그인한 스토어(`JWT sub`) 소속 미션 1건을 조회합니다.',
    }),
    ApiParam(MISSION_ID_PARAM),
    ApiOkResponse({ description: 'Mission 단건' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
    ApiNotFoundResponse({ description: '해당 스토어의 미션을 찾지 못함' }),
  ],
];
export const ApiMissionGetOneDocs = () => composeMethodGroups(MISSION_GET_ONE_GROUPS);

const MISSION_UPDATE_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '미션 정보 수정(부스)',
      description: '**JWT 필수.** `missionName`, `description`, `reward`를 부분 수정합니다.',
    }),
    ApiParam(MISSION_ID_PARAM),
    ApiConsumes('application/json'),
    ApiBody(MISSION_UPDATE_BODY),
    ApiOkResponse({ description: '수정된 Mission' }),
    ApiBadRequestResponse({ description: '유효성 검사 실패' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
    ApiNotFoundResponse({ description: '해당 스토어의 미션을 찾지 못함' }),
  ],
];
export const ApiMissionUpdateDocs = () => composeMethodGroups(MISSION_UPDATE_GROUPS);

const MISSION_TOGGLE_ACTIVE_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '미션 활성화 토글(부스)',
      description: '**JWT 필수.** `PATCH /missions/{id}/active` 로 미션 활성화 여부를 변경합니다.',
    }),
    ApiParam(MISSION_ID_PARAM),
    ApiConsumes('application/json'),
    ApiBody(MISSION_ACTIVE_BODY),
    ApiOkResponse({ description: '활성화 여부가 반영된 Mission' }),
    ApiBadRequestResponse({ description: '유효성 검사 실패' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
    ApiNotFoundResponse({ description: '해당 스토어의 미션을 찾지 못함' }),
  ],
];
export const ApiMissionToggleActiveDocs = () =>
  composeMethodGroups(MISSION_TOGGLE_ACTIVE_GROUPS);

const MISSION_DELETE_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '미션 삭제(부스)',
      description: '**JWT 필수.** 로그인한 스토어(`JWT sub`) 소속 미션을 삭제합니다.',
    }),
    ApiParam(MISSION_ID_PARAM),
    ApiOkResponse({ description: '삭제된 Mission' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
    ApiNotFoundResponse({ description: '해당 스토어의 미션을 찾지 못함' }),
  ],
];
export const ApiMissionDeleteDocs = () => composeMethodGroups(MISSION_DELETE_GROUPS);
