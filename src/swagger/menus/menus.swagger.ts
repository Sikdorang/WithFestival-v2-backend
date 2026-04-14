import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
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
