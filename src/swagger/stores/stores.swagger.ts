import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SWAGGER_JWT_REF } from '../common/constants';
import {
  type DecoratorArg,
  composeClass,
  composeMethod,
  composeMethodGroups,
} from '../common/compose';
import { STORES_SWAGGER_TAG } from './tag.constants';

const STORE_PATCH_DEFS = [
  { route: 'name', summary: '스토어 이름 수정' },
  { route: 'account-number', summary: '계좌번호 수정' },
  { route: 'notice', summary: '공지 수정' },
  { route: 'event', summary: '이벤트 문구 수정' },
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
