import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  type DecoratorArg,
  composeClass,
  composeMethodGroups,
} from '../common/compose';
import { OPENAPI_CREATE_LOG, OPENAPI_LOG_ENTITY_SCHEMA } from './dto.openapi';
import { LOGS_SWAGGER_TAG } from './tag.constants';

const LOG_CREATE_BODY = {
  schema: {
    type: 'object' as const,
    required: ['identifier', 'action', 'storeId'],
    properties: {
      identifier: {
        type: 'string',
        example: OPENAPI_CREATE_LOG.identifier.example,
        maxLength: OPENAPI_CREATE_LOG.identifier.maxLength,
        description: OPENAPI_CREATE_LOG.identifier.description,
      },
      action: {
        type: 'string',
        example: OPENAPI_CREATE_LOG.action.example,
        maxLength: OPENAPI_CREATE_LOG.action.maxLength,
        description: OPENAPI_CREATE_LOG.action.description,
      },
      storeId: {
        type: 'integer',
        example: OPENAPI_CREATE_LOG.storeId.example,
        minimum: OPENAPI_CREATE_LOG.storeId.minimum,
        description: OPENAPI_CREATE_LOG.storeId.description,
      },
    },
  },
};

export const ApiLogsPublicControllerDocs = () =>
  composeClass(ApiTags(LOGS_SWAGGER_TAG));

const LOG_CREATE_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '로그 적재',
      description:
        '**JWT 불필요.** `POST /logs`. 프론트에서 `identifier`, `action`, `storeId`를 보내면 `Log` row를 생성합니다.',
    }),
    ApiConsumes('application/json'),
    ApiBody(LOG_CREATE_BODY),
    ApiCreatedResponse({
      description: '생성된 Log row',
      schema: OPENAPI_LOG_ENTITY_SCHEMA,
    }),
    ApiBadRequestResponse({
      description:
        '본문 검증 실패(identifier/action/storeId 누락·형식 오류·길이 초과)',
    }),
  ],
];

export const ApiLogCreateDocs = () => composeMethodGroups(LOG_CREATE_GROUPS);
