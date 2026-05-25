import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  type DecoratorArg,
  composeClass,
  composeMethodGroups,
} from '../common/compose';
import {
  OPENAPI_BLIND_DATE_ENTITY_SCHEMA,
  OPENAPI_BLIND_DATE_LIST_RESPONSE_SCHEMA,
} from './dto.openapi';
import { BLIND_DATES_SWAGGER_TAG } from './tag.constants';

/** 컨트롤러 클래스 데코레이터 묶음 — JWT 없음(공개 응모/조회) */
export const ApiBlindDatesControllerDocs = () =>
  composeClass(ApiTags(BLIND_DATES_SWAGGER_TAG));

const BLIND_DATE_CREATE_DECORATORS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '소개팅 명단 응모(공개)',
      description:
        '**JWT 없음.** `POST /blind-dates` — 본인 정보·연락처·MBTI·외모 스타일·성별과 매칭 시 상대 번호를 받을 휴대폰 번호(`deliveryPhone`)를 저장합니다.\n\n' +
        '`numberDelivered` 필드는 운영자 표시용이므로 **본 API에서는 받지 않으며 항상 `false`로 생성**됩니다.\n\n' +
        '`gender`는 `MALE`(남) 또는 `FEMALE`(녀) enum 문자열로 보내야 합니다.',
    }),
    ApiCreatedResponse({
      description: '생성된 BlindDate 엔티티',
      schema: OPENAPI_BLIND_DATE_ENTITY_SCHEMA,
    }),
    ApiBadRequestResponse({
      description: '본문 유효성 검사 실패(필수 필드 누락, 형식·범위 위반 등)',
    }),
  ],
];

export const ApiBlindDateCreateDocs = () =>
  composeMethodGroups(BLIND_DATE_CREATE_DECORATORS);

const BLIND_DATE_LIST_DECORATORS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '소개팅 명단 전체 조회(공개)',
      description:
        '**JWT 없음, 본문 없음.** `GET /blind-dates` — 전체 응모 명단을 `createdAt` 내림차순으로 반환합니다.\n\n' +
        '모든 컬럼이 포함되며 운영자 표시용 `numberDelivered`도 함께 옵니다.\n\n' +
        '⚠️ **개인정보 주의**: 응답에 응모자의 이름·연락처·휴대폰 번호 등이 포함됩니다. 인증을 두지 않으므로 운영 환경에서는 URL 비공개·네트워크 레벨 차단 등 별도 보호 조치를 권장합니다.',
    }),
    ApiOkResponse({
      description: 'BlindDate[] (createdAt 내림차순)',
      schema: OPENAPI_BLIND_DATE_LIST_RESPONSE_SCHEMA,
    }),
  ],
];

export const ApiBlindDateListDocs = () =>
  composeMethodGroups(BLIND_DATE_LIST_DECORATORS);
