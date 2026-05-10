import type { ApiPropertyOptions } from '@nestjs/swagger';

export const OPENAPI_CREATE_RESERVATION_SLOT = {
  startTime: {
    example: '10:00',
    description: '예약 시작 시간 문자열',
    maxLength: 32,
  },
  endTime: {
    example: '11:30',
    description: '예약 종료 시간 문자열',
    maxLength: 32,
  },
  availableTables: {
    example: 8,
    description: '해당 시간대 예약 가능 테이블 수',
    minimum: 0,
    maximum: 500,
  },
} satisfies Record<string, ApiPropertyOptions>;

export const OPENAPI_CREATE_RESERVATION = {
  reservationSlotId: {
    example: 3,
    description: '선택한 예약 가능 시간대 PK (`ReservationSlot.id`)',
    minimum: 1,
  },
  reserverName: {
    example: '홍길동',
    description: '예약자 이름',
    maxLength: 200,
  },
  phoneNumber: {
    example: '01012345678',
    description: '예약자 연락처',
    maxLength: 32,
  },
  partySize: {
    example: 4,
    description: '예약 인원 수',
    minimum: 1,
    maximum: 500,
  },
} satisfies Record<string, ApiPropertyOptions>;

/** 시간대 목록 API 응답 항목 (`reservedTeamCount`: 삭제되지 않은 예약 건수 = 팀 수) */
export const OPENAPI_RESERVATION_SLOT_LIST_ITEM_SCHEMA = {
  type: 'object',
  required: [
    'id',
    'storeId',
    'startTime',
    'endTime',
    'availableTables',
    'createdAt',
    'updatedAt',
    'reservedTeamCount',
  ],
  properties: {
    id: { type: 'integer', example: 1 },
    storeId: { type: 'integer', example: 1 },
    startTime: { type: 'string', example: '10:00' },
    endTime: { type: 'string', example: '11:30' },
    availableTables: { type: 'integer', example: 8, minimum: 0 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    reservedTeamCount: {
      type: 'integer',
      minimum: 0,
      example: 3,
      description:
        '해당 시간대에 예약된 팀 수(`deleted === false`인 Reservation 건수)',
    },
  },
};

export const OPENAPI_RESERVATION_SLOT_LIST_RESPONSE_SCHEMA = {
  type: 'array',
  items: OPENAPI_RESERVATION_SLOT_LIST_ITEM_SCHEMA,
};
