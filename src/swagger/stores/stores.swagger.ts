import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SWAGGER_JWT_REF } from '../common/constants';
import {
  type DecoratorArg,
  composeClass,
  composeMethod,
  composeMethodGroups,
} from '../common/compose';
import { OPENAPI_STORE_PUBLIC_INFO_RESPONSE_SCHEMA } from './dto.openapi';
import { STORES_SWAGGER_TAG } from './tag.constants';

const STORE_PATCH_DEFS = [
  { route: 'name', summary: '스토어 이름 수정' },
  { route: 'account-number', summary: '계좌번호 수정' },
  { route: 'notice', summary: '공지 수정' },
  { route: 'event', summary: '이벤트 문구 수정' },
  { route: 'reservation-enabled', summary: '예약 기능 활성화 여부 수정' },
  { route: 'missions-enabled', summary: '미션 기능 활성화 여부 수정' },
] as const;

const patchSummaryByRoute: Record<string, string> = {};
for (const { route, summary } of STORE_PATCH_DEFS) {
  patchSummaryByRoute[route] = summary;
}

const STORE_JWT_GROUP: DecoratorArg[] = [ApiBearerAuth(SWAGGER_JWT_REF)];

export const ApiStoresControllerDocs = () =>
  composeClass(ApiTags(STORES_SWAGGER_TAG));

export const ApiStoreCreateDocs = () =>
  composeMethod(
    ApiOperation({ summary: '스토어(부스) 생성', description: 'JWT 불필요' }),
  );

export const ApiStorePublicInfoDocs = () =>
  composeMethod(
    ApiOperation({
      summary: '스토어(부스) 공개 정보 조회',
      description:
        '**JWT 불필요.** 부스 이름(`name`), 계좌(`accountNumber`), 공지(`notice`), 이벤트 문구(`event`) 등 고객 화면용 필드만 반환합니다. `authCode` 등 관리용 값은 포함하지 않습니다.',
    }),
    ApiParam({
      name: 'storeId',
      type: Number,
      example: 1,
      description: '스토어 PK (`Store.id`)',
    }),
    ApiOkResponse({ schema: OPENAPI_STORE_PUBLIC_INFO_RESPONSE_SCHEMA }),
    ApiNotFoundResponse({ description: '해당 `storeId` 스토어 없음' }),
  );

/** `routeKey`는 URL 세그먼트 (`name`, `account-number`, …) */
export function ApiStoreJwtPatch(routeKey: string) {
  const summary = patchSummaryByRoute[routeKey];
  if (!summary) {
    throw new Error(`Unknown store patch routeKey: ${routeKey}`);
  }
  return composeMethodGroups([
    STORE_JWT_GROUP,
    [ApiOperation({ summary })],
  ]);
}
