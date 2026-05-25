import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
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

/** 컨트롤러 클래스 데코레이터 묶음 — JWT 없음(공개 응모) */
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

const BLIND_DATE_LIST_BODY = {
  schema: {
    type: 'object' as const,
    required: ['password'],
    properties: {
      password: {
        type: 'string',
        minLength: 1,
        maxLength: 128,
        writeOnly: true,
        description:
          '운영자 인증 비밀번호. 서버 측 `BLIND_DATE_ADMIN_PASSWORD` 환경변수 값과 정확히 일치해야 합니다. **실제 값은 본 공개 문서에 노출하지 않으며, 운영자에게 별도 채널로 전달**됩니다.',
      },
    },
  },
};

const BLIND_DATE_LIST_DECORATORS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '소개팅 명단 전체 조회(인증 본문)',
      description:
        '**JWT 없음.** `GET /blind-dates` — 요청 본문(JSON)에 `password`를 정확히 일치하게 보내야만 응답을 받습니다.\n\n' +
        '인증값은 **서버 환경변수 `BLIND_DATE_ADMIN_PASSWORD`** 만으로 관리하며, 소스코드·본 공개 문서 어디에도 실제 값은 노출하지 않습니다. 환경변수 미설정 환경에서는 **503** 으로 거부합니다.\n\n' +
        '응답은 `BlindDate[]` (최신순). 모든 컬럼이 포함되며 운영자 표시용 `numberDelivered`도 함께 옵니다.\n\n' +
        '⚠️ **클라이언트 주의** — HTTP 표준상 GET 본문은 비표준이라 일부 클라이언트(브라우저 `fetch`, 일부 프록시)는 본문을 전달하지 못할 수 있습니다. 권장: Postman 또는 `curl -X GET -H "Content-Type: application/json" --data \'{"password":"<운영자 발급값>"}\'`.',
    }),
    ApiBody(BLIND_DATE_LIST_BODY),
    ApiOkResponse({
      description: 'BlindDate[] (createdAt 내림차순)',
      schema: OPENAPI_BLIND_DATE_LIST_RESPONSE_SCHEMA,
    }),
    ApiBadRequestResponse({
      description: '본문 유효성 검사 실패(`password` 누락 등)',
    }),
    ApiUnauthorizedResponse({ description: '`password` 불일치' }),
    ApiServiceUnavailableResponse({
      description:
        '서버에 `BLIND_DATE_ADMIN_PASSWORD` 환경변수가 설정되지 않아 인증이 비활성화된 상태',
    }),
  ],
];

export const ApiBlindDateListDocs = () =>
  composeMethodGroups(BLIND_DATE_LIST_DECORATORS);
