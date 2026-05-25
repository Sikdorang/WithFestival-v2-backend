import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  type DecoratorArg,
  composeClass,
  composeMethodGroups,
} from '../common/compose';
import { OPENAPI_BLIND_DATE_ENTITY_SCHEMA } from './dto.openapi';
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
