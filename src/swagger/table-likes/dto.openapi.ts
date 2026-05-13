import type { ApiPropertyOptions } from '@nestjs/swagger';

export const OPENAPI_CREATE_TABLE_LIKE = {
  nickname: {
    example: '토끼손님',
    maxLength: 200,
    description: '좋아요를 누른 사용자의 표시 이름',
  } satisfies ApiPropertyOptions,
  storeId: {
    example: 1,
    minimum: 1,
    description: '스토어 PK',
  } satisfies ApiPropertyOptions,
  tableId: {
    example: 5,
    minimum: 1,
    description: '테이블 번호',
  } satisfies ApiPropertyOptions,
} as const;

export const OPENAPI_INCREMENT_TABLE_LIKE = {
  tokenUuid: {
    example: '550e8400-e29b-41d4-a716-446655440000',
    maxLength: 191,
    description: '`POST /table-likes/nickname` 응답으로 받은 UUID 토큰',
  } satisfies ApiPropertyOptions,
} as const;

export const OPENAPI_TABLE_LIKE_CREATED_SCHEMA = {
  type: 'object',
  required: [
    'id',
    'tokenUuid',
    'nickname',
    'storeId',
    'tableId',
    'likeCount',
    'totalLikeCount',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: {
      type: 'integer',
      example: 1,
      description: 'TableLike PK',
    },
    tokenUuid: {
      type: 'string',
      example: '550e8400-e29b-41d4-a716-446655440000',
      description: '백엔드가 생성한 UUID 토큰',
    },
    nickname: {
      type: 'string',
      example: '토끼손님',
    },
    storeId: {
      type: 'integer',
      example: 1,
    },
    tableId: {
      type: 'integer',
      example: 5,
    },
    likeCount: {
      type: 'integer',
      minimum: 0,
      example: 1,
      description: '생성된 row의 좋아요 수',
    },
    totalLikeCount: {
      type: 'integer',
      minimum: 0,
      example: 12,
      description: '해당 스토어/테이블의 전체 좋아요 누적 수',
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
} as Record<string, unknown>;

export const OPENAPI_STORE_TABLE_LIKE_LIST_SCHEMA = {
  type: 'array',
  items: {
    type: 'object',
    required: ['storeId', 'tableId', 'totalLikeCount', 'likes'],
    properties: {
      storeId: {
        type: 'integer',
        example: 1,
        description: '스토어 PK',
      },
      tableId: {
        type: 'integer',
        example: 5,
        description: '테이블 번호',
      },
      totalLikeCount: {
        type: 'integer',
        minimum: 0,
        example: 12,
        description: '해당 테이블 전체 좋아요 수',
      },
      likes: {
        type: 'array',
        items: {
          type: 'object',
          required: ['nickname', 'likeCount'],
          properties: {
            nickname: {
              type: 'string',
              example: '토끼손님',
            },
            likeCount: {
              type: 'integer',
              minimum: 0,
              example: 3,
              description: '해당 닉네임이 받은 좋아요 수',
            },
          },
        },
      },
    },
  },
} as Record<string, unknown>;

export const OPENAPI_MY_TABLE_LIKE_COUNT_SCHEMA = {
  type: 'object',
  required: ['tokenUuid', 'storeId', 'tableId', 'nickname', 'likeCount'],
  properties: {
    tokenUuid: {
      type: 'string',
      example: '550e8400-e29b-41d4-a716-446655440000',
      description: '백엔드가 발급한 UUID 토큰',
    },
    storeId: {
      type: 'integer',
      example: 1,
      description: '스토어 PK',
    },
    tableId: {
      type: 'integer',
      example: 5,
      description: '테이블 번호',
    },
    nickname: {
      type: 'string',
      example: '토끼손님',
    },
    likeCount: {
      type: 'integer',
      minimum: 0,
      example: 3,
      description: '해당 UUID 토큰 사용자가 받은 좋아요 수',
    },
  },
} as Record<string, unknown>;
