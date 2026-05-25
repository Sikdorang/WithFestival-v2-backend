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
  OPENAPI_MENU_ENTITY_RESPONSE_SCHEMA,
  OPENAPI_MENU_PUBLIC_LIST_RESPONSE_SCHEMA,
  OPENAPI_MENU_STAFF_LIST_RESPONSE_SCHEMA,
} from './dto.openapi';
import { MENUS_SWAGGER_TAG } from './tag.constants';

type MultipartField = { key: string; schema: Record<string, unknown> };

const MENU_MULTIPART_FIELDS: MultipartField[] = [
  {
    key: 'image',
    schema: {
      type: 'string',
      format: 'binary',
      description:
        '선택. 없으면 `imageUrl`은 null입니다. jpeg, png, webp, gif · 최대 10MB',
    },
  },
  { key: 'name', schema: { type: 'string', example: '떡볶이' } },
  {
    key: 'price',
    schema: {
      type: 'integer',
      example: 4500,
      default: 0,
      description: '선택. 생략 시 0',
    },
  },
  {
    key: 'marginRate',
    schema: {
      type: 'integer',
      example: 15,
      default: 0,
      minimum: 0,
      maximum: 100,
      description: '선택. 마진율(%). 생략 시 0',
    },
  },
  {
    key: 'description',
    schema: {
      type: 'string',
      example: '순한맛',
      description: '선택',
    },
  },
  {
    key: 'nameEn',
    schema: {
      type: 'string',
      example: 'Tteokbokki',
      description: '선택. 영어 메뉴명',
    },
  },
  {
    key: 'nameZh',
    schema: {
      type: 'string',
      example: '辣炒年糕',
      description: '선택. 중국어 메뉴명',
    },
  },
  {
    key: 'nameJa',
    schema: {
      type: 'string',
      example: 'トッポッキ',
      description: '선택. 일본어 메뉴명',
    },
  },
  {
    key: 'descriptionEn',
    schema: {
      type: 'string',
      example: 'Mild spicy',
      description: '선택. 영어 설명',
    },
  },
  {
    key: 'descriptionZh',
    schema: {
      type: 'string',
      example: '微辣',
      description: '선택. 중국어 설명',
    },
  },
  {
    key: 'descriptionJa',
    schema: {
      type: 'string',
      example: '甘口',
      description: '선택. 일본어 설명',
    },
  },
];

const MENU_REQUIRED_KEYS = ['name'] as const;

function buildMenuMultipartSchema() {
  const properties: Record<string, Record<string, unknown>> = {};
  for (const { key, schema } of MENU_MULTIPART_FIELDS) {
    properties[key] = schema;
  }
  return {
    type: 'object' as const,
    required: [...MENU_REQUIRED_KEYS],
    properties,
  };
}

const MENU_CREATE_BODY = { schema: buildMenuMultipartSchema() };

const MENU_PATCH_MULTIPART_FIELDS: MultipartField[] = [
  {
    key: 'image',
    schema: {
      type: 'string',
      format: 'binary',
      description:
        '선택. 파일이 있으면 S3에 업로드 후 `imageUrl`만 갱신합니다. jpeg, png, webp, gif · 최대 10MB',
    },
  },
  {
    key: 'name',
    schema: {
      type: 'string',
      example: '떡볶이',
      description: '선택. 보낸 경우에만 메뉴명을 덮어씁니다.',
    },
  },
  {
    key: 'price',
    schema: {
      type: 'integer',
      example: 4500,
      description: '선택. 보낸 경우에만 가격을 덮어씁니다.',
    },
  },
  {
    key: 'marginRate',
    schema: {
      type: 'integer',
      example: 15,
      minimum: 0,
      maximum: 100,
      description: '선택. 보낸 경우에만 마진율(%)을 덮어씁니다.',
    },
  },
  {
    key: 'description',
    schema: {
      type: 'string',
      example: '순한맛',
      description:
        '선택. 보낸 경우에만 반영합니다. 빈 문자열이면 DB에서 설명을 제거(null)합니다.',
    },
  },
  {
    key: 'nameEn',
    schema: {
      type: 'string',
      example: 'Tteokbokki',
      description:
        '선택. 영어 메뉴명. 보낸 경우에만 반영. 빈 문자열이면 null로 제거.',
    },
  },
  {
    key: 'nameZh',
    schema: {
      type: 'string',
      example: '辣炒年糕',
      description:
        '선택. 중국어 메뉴명. 보낸 경우에만 반영. 빈 문자열이면 null로 제거.',
    },
  },
  {
    key: 'nameJa',
    schema: {
      type: 'string',
      example: 'トッポッキ',
      description:
        '선택. 일본어 메뉴명. 보낸 경우에만 반영. 빈 문자열이면 null로 제거.',
    },
  },
  {
    key: 'descriptionEn',
    schema: {
      type: 'string',
      example: 'Mild spicy',
      description:
        '선택. 영어 설명. 보낸 경우에만 반영. 빈 문자열이면 null로 제거.',
    },
  },
  {
    key: 'descriptionZh',
    schema: {
      type: 'string',
      example: '微辣',
      description:
        '선택. 중국어 설명. 보낸 경우에만 반영. 빈 문자열이면 null로 제거.',
    },
  },
  {
    key: 'descriptionJa',
    schema: {
      type: 'string',
      example: '甘口',
      description:
        '선택. 일본어 설명. 보낸 경우에만 반영. 빈 문자열이면 null로 제거.',
    },
  },
];

function buildMenuPatchMultipartSchema() {
  const properties: Record<string, Record<string, unknown>> = {};
  for (const { key, schema } of MENU_PATCH_MULTIPART_FIELDS) {
    properties[key] = schema;
  }
  return {
    type: 'object' as const,
    properties,
  };
}

const MENU_PATCH_BODY = { schema: buildMenuPatchMultipartSchema() };

export const ApiMenusControllerDocs = () =>
  composeClass(
    ApiTags(MENUS_SWAGGER_TAG),
    ApiBearerAuth(SWAGGER_JWT_REF),
  );

/** 고객용 메뉴 목록 — JWT 없음, `stores` 경로 */
export const ApiMenusPublicControllerDocs = () =>
  composeClass(ApiTags(MENUS_SWAGGER_TAG));

const MENU_PUBLIC_LIST_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '메뉴 목록(고객)',
      description:
        '**JWT 불필요.** 경로 `storeId`(스토어·부스 PK)에 해당하는 **활성 메뉴**(`deleted === false`)만 `id` 오름차순으로 반환합니다. `marginRate`는 정수 **%**, `isSoldOut`이 **품절** 여부입니다. 스토어가 없으면 404입니다.',
    }),
    ApiParam({
      name: 'storeId',
      type: Number,
      example: 1,
      description: '스토어 PK (`Store.id`)',
    }),
    ApiOkResponse({
      description: '메뉴 배열',
      schema: OPENAPI_MENU_PUBLIC_LIST_RESPONSE_SCHEMA,
    }),
    ApiNotFoundResponse({ description: '해당 `storeId` 스토어 없음' }),
  ],
];

export const ApiMenuPublicListDocs = () =>
  composeMethodGroups(MENU_PUBLIC_LIST_GROUPS);

const MENU_POST_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '메뉴 등록',
      description:
        '**JWT 필수.** `Authorization: Bearer <accessToken>`. 스토어 구분은 JWT payload의 `sub`(store PK)이며, 별도 `storeId` 필드는 없습니다.\n\n' +
        'multipart: **`name`만 필수.** `image`, `price`, `marginRate`, `description`, 그리고 다국어 필드(`nameEn`/`nameZh`/`nameJa`, `descriptionEn`/`descriptionZh`/`descriptionJa`)는 모두 선택입니다. `price`·`marginRate` 생략 시 **0**입니다. `marginRate`는 정수 **%**(0~100). 이미지가 있으면 S3 업로드 후 `imageUrl`에 저장하고, 없으면 `imageUrl`은 null입니다.\n\n' +
        '**자동 번역**: 등록 시 한국어 `name`(필수)과 `description`(있는 경우)을 기반으로 Google Cloud Translation API를 호출해서 영/중/일 번역을 자동 채웁니다. 사용자가 특정 언어를 직접 입력하면 그 값이 우선됩니다. 번역 API 미설정·실패 시 해당 번역 필드는 `null`로 저장됩니다(메뉴 등록 자체는 성공).',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody(MENU_CREATE_BODY),
    ApiCreatedResponse({
      description: '생성된 Menu (`isSoldOut` 기본 false)',
      schema: OPENAPI_MENU_ENTITY_RESPONSE_SCHEMA,
    }),
  ],
];

export const ApiMenuCreateDocs = () =>
  composeMethodGroups(MENU_POST_DECORATOR_GROUPS);

const MENU_LIST_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '메뉴 목록',
      description:
        '**JWT 필수.** `sub`(store PK)에 해당하는 스토어의 메뉴만 조회합니다. **`deleted === false`** 인 활성 메뉴만 반환합니다(`id` 오름차순). `marginRate`는 정수 **%**, `isSoldOut`은 품절 여부입니다.',
    }),
    ApiOkResponse({
      description: '활성 Menu 배열',
      schema: OPENAPI_MENU_STAFF_LIST_RESPONSE_SCHEMA,
    }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];

export const ApiMenuListDocs = () =>
  composeMethodGroups(MENU_LIST_DECORATOR_GROUPS);

const MENU_PATCH_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '메뉴 수정',
      description:
        '**JWT 필수.** `Authorization: Bearer <accessToken>`. 스토어는 JWT payload의 `sub`(store PK)로 결정됩니다.\n\n' +
        '`PATCH /menus/:id` — `:id`는 메뉴 PK입니다. 해당 메뉴가 **같은 스토어**에 속하지 않으면 404입니다.\n\n' +
        '`multipart/form-data`: `image`, `name`, `price`, `marginRate`, `description`, 그리고 다국어 필드(`nameEn`/`nameZh`/`nameJa`, `descriptionEn`/`descriptionZh`/`descriptionJa`)는 **전부 선택**이며, **요청에 실제로 포함된 항목만** DB에 반영합니다. 다국어 필드는 빈 문자열로 보내면 해당 언어를 null로 제거합니다. 필드·이미지를 하나도 보내지 않으면 400입니다.\n\n' +
        '**자동 번역**: 한국어 `name` 또는 `description`을 이번 요청에 새로 보내면, 동일 요청에 명시적으로 보내지 *않은* 다국어 필드들은 새 한국어 값을 기준으로 영/중/일이 자동 재번역되어 덮어써집니다. 가격·마진율·이미지만 수정하는 경우엔 기존 번역은 그대로 유지됩니다. 사용자가 특정 언어 필드를 직접 입력하면 그 값이 우선됩니다.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: '수정할 메뉴 PK (`Menu.id`)',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody(MENU_PATCH_BODY),
    ApiOkResponse({
      description: '수정된 Menu 레코드',
      schema: OPENAPI_MENU_ENTITY_RESPONSE_SCHEMA,
    }),
    ApiBadRequestResponse({
      description:
        '본문·파일 모두 비어 있음(반영할 필드 없음), 또는 유효성 검사 실패',
    }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
    ApiNotFoundResponse({
      description: '해당 `id`의 메뉴가 없거나, JWT 스토어와 `storeId`가 불일치',
    }),
  ],
];

export const ApiMenuPatchDocs = () =>
  composeMethodGroups(MENU_PATCH_DECORATOR_GROUPS);

const MENU_DELETE_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '메뉴 삭제(소프트)',
      description:
        '**JWT 필수.** `Authorization: Bearer <accessToken>`. 스토어는 JWT payload의 `sub`(store PK)로 결정됩니다.\n\n' +
        '`DELETE /menus/:id` — `:id`는 메뉴 PK입니다. **hard delete가 아니라** `deleted` 플래그를 **true**로 두는 **soft delete**입니다(기본값 false). 이미 삭제된 메뉴는 404로 취급합니다.\n\n' +
        '주문 스냅샷(`OrderItem`)과의 FK는 유지되므로, 주문 이력이 있어도 행은 남습니다.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: '삭제할 메뉴 PK (`Menu.id`)',
    }),
    ApiNoContentResponse({ description: '삭제 완료(본문 없음)' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
    ApiNotFoundResponse({
      description:
        '해당 `id`의 활성 메뉴가 없음(없는 id·다른 스토어·이미 soft delete됨)',
    }),
  ],
];

export const ApiMenuDeleteDocs = () =>
  composeMethodGroups(MENU_DELETE_DECORATOR_GROUPS);

const MENU_SOLD_OUT_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '메뉴 품절 처리',
      description:
        '**JWT 필수.** 해당 스토어의 활성 메뉴(`deleted === false`)에 대해 `isSoldOut`을 **true**로 설정합니다. 본문 없음. 이미 품절이면 그대로 true로 덮어씁니다(멱등).',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: '메뉴 PK (`Menu.id`)',
    }),
    ApiOkResponse({
      description: '갱신된 Menu',
      schema: OPENAPI_MENU_ENTITY_RESPONSE_SCHEMA,
    }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
    ApiNotFoundResponse({
      description:
        '해당 `id`의 활성 메뉴가 없음(없는 id·다른 스토어·이미 soft delete)',
    }),
  ],
];

export const ApiMenuMarkSoldOutDocs = () =>
  composeMethodGroups(MENU_SOLD_OUT_GROUPS);

const MENU_AVAILABLE_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '메뉴 판매 재개(품절 해제)',
      description:
        '**JWT 필수.** 해당 스토어의 활성 메뉴에 대해 `isSoldOut`을 **false**로 되돌립니다. 멱등.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: '메뉴 PK (`Menu.id`)',
    }),
    ApiOkResponse({
      description: '갱신된 Menu',
      schema: OPENAPI_MENU_ENTITY_RESPONSE_SCHEMA,
    }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
    ApiNotFoundResponse({
      description:
        '해당 `id`의 활성 메뉴가 없음(없는 id·다른 스토어·이미 soft delete)',
    }),
  ],
];

export const ApiMenuMarkAvailableDocs = () =>
  composeMethodGroups(MENU_AVAILABLE_GROUPS);
