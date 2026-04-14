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
import { type DecoratorArg, composeClass, composeMethodGroups } from '../common/compose';
import { MENUS_SWAGGER_TAG } from './tag.constants';

type MultipartField = { key: string; schema: Record<string, unknown> };

const MENU_MULTIPART_FIELDS: MultipartField[] = [
  {
    key: 'image',
    schema: {
      type: 'string',
      format: 'binary',
      description: 'jpeg, png, webp, gif · 최대 10MB',
    },
  },
  { key: 'name', schema: { type: 'string', example: '떡볶이' } },
  { key: 'price', schema: { type: 'integer', example: 4500 } },
  { key: 'description', schema: { type: 'string', example: '순한맛' } },
];

const MENU_REQUIRED_KEYS = ['image', 'name', 'price'] as const;

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
    key: 'description',
    schema: {
      type: 'string',
      example: '순한맛',
      description:
        '선택. 보낸 경우에만 반영합니다. 빈 문자열이면 DB에서 설명을 제거(null)합니다.',
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

const MENU_POST_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '메뉴 등록',
      description:
        '**JWT 필수.** `Authorization: Bearer <accessToken>`. 스토어 구분은 JWT payload의 `sub`(store PK)이며, 별도 `storeId` 필드는 없습니다.\n\n' +
        'multipart: `image`(파일), `name`, `price`, 선택 `description`. 이미지는 S3 업로드 후 URL을 DB `imageUrl`에 저장합니다.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody(MENU_CREATE_BODY),
    ApiCreatedResponse({ description: '생성된 Menu' }),
  ],
];

export const ApiMenuCreateDocs = () =>
  composeMethodGroups(MENU_POST_DECORATOR_GROUPS);

const MENU_PATCH_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '메뉴 수정',
      description:
        '**JWT 필수.** `Authorization: Bearer <accessToken>`. 스토어는 JWT payload의 `sub`(store PK)로 결정됩니다.\n\n' +
        '`PATCH /menus/:id` — `:id`는 메뉴 PK입니다. 해당 메뉴가 **같은 스토어**에 속하지 않으면 404입니다.\n\n' +
        '`multipart/form-data`: `image`, `name`, `price`, `description`은 **전부 선택**이며, **요청에 실제로 포함된 항목만** DB에 반영합니다. 필드·이미지를 하나도 보내지 않으면 400입니다.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 1,
      description: '수정할 메뉴 PK (`Menu.id`)',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody(MENU_PATCH_BODY),
    ApiOkResponse({ description: '수정된 Menu 레코드' }),
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
