import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
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
import { RESERVATIONS_SWAGGER_TAG } from './tag.constants';

const RESERVATION_SLOT_CREATE_BODY = {
  schema: {
    type: 'object' as const,
    required: ['startTime', 'endTime', 'availableTables'],
    properties: {
      startTime: {
        type: 'string',
        example: '10:00',
        description: '예약 시작 시간 문자열',
      },
      endTime: {
        type: 'string',
        example: '11:30',
        description: '예약 종료 시간 문자열',
      },
      availableTables: {
        type: 'integer',
        example: 8,
        minimum: 0,
        description: '해당 시간대 예약 가능 테이블 수',
      },
    },
  },
};

const RESERVATION_CREATE_BODY = {
  schema: {
    type: 'object' as const,
    required: ['reservationSlotId', 'reserverName', 'phoneNumber', 'partySize'],
    properties: {
      reservationSlotId: {
        type: 'integer',
        example: 3,
        minimum: 1,
        description: '선택한 예약 가능 시간대 PK (`ReservationSlot.id`)',
      },
      reserverName: {
        type: 'string',
        example: '홍길동',
        maxLength: 200,
        description: '예약자 이름',
      },
      phoneNumber: {
        type: 'string',
        example: '01012345678',
        maxLength: 32,
        description: '예약자 연락처',
      },
      partySize: {
        type: 'integer',
        example: 4,
        minimum: 1,
        description: '예약 인원 수',
      },
    },
  },
};

export const ApiReservationSlotsPublicControllerDocs = () =>
  composeClass(ApiTags(RESERVATIONS_SWAGGER_TAG));

const RESERVATION_SLOT_PUBLIC_LIST_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '예약 가능 시간대 목록(고객)',
      description:
        'JWT 없음. `GET /stores/{storeId}/reservation-slots`. 해당 스토어에 등록된 예약 가능 시간대를 반환합니다.',
    }),
    ApiParam({
      name: 'storeId',
      type: Number,
      example: 1,
      description: '스토어 PK (`Store.id`)',
    }),
    ApiOkResponse({ description: 'ReservationSlot 배열' }),
    ApiNotFoundResponse({ description: '`storeId`에 해당하는 스토어 없음' }),
  ],
];

export const ApiReservationSlotsPublicListDocs = () =>
  composeMethodGroups(RESERVATION_SLOT_PUBLIC_LIST_DECORATOR_GROUPS);

const RESERVATION_PUBLIC_CREATE_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '예약자 생성(고객)',
      description:
        'JWT 없음. `POST /stores/{storeId}/reservations`. `reservationSlotId`는 해당 `storeId`의 시간대여야 합니다.',
    }),
    ApiConsumes('application/json'),
    ApiParam({
      name: 'storeId',
      type: Number,
      example: 1,
      description: '스토어 PK (`Store.id`)',
    }),
    ApiBody(RESERVATION_CREATE_BODY),
    ApiCreatedResponse({
      description: '생성된 Reservation (reservationSlot 포함)',
    }),
    ApiBadRequestResponse({ description: '유효성 검사 실패' }),
    ApiNotFoundResponse({
      description: '스토어 없음 또는 해당 스토어의 reservationSlotId 아님',
    }),
  ],
];

export const ApiReservationsPublicCreateDocs = () =>
  composeMethodGroups(RESERVATION_PUBLIC_CREATE_DECORATOR_GROUPS);

export const ApiReservationSlotsStaffControllerDocs = () =>
  composeClass(
    ApiTags(RESERVATIONS_SWAGGER_TAG),
    ApiBearerAuth(SWAGGER_JWT_REF),
  );

const RESERVATION_SLOT_CREATE_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '예약 가능 시간대 생성(부스)',
      description:
        '**JWT 필수.** 로그인한 스토어(`JWT sub`)에 예약 가능 시간대를 추가합니다.',
    }),
    ApiConsumes('application/json'),
    ApiBody(RESERVATION_SLOT_CREATE_BODY),
    ApiCreatedResponse({ description: '생성된 ReservationSlot' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];

export const ApiReservationSlotsCreateDocs = () =>
  composeMethodGroups(RESERVATION_SLOT_CREATE_DECORATOR_GROUPS);

const RESERVATION_SLOT_LIST_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '예약 가능 시간대 목록(부스)',
      description:
        '**JWT 필수.** 로그인한 스토어(`JWT sub`)에 등록된 예약 가능 시간대를 조회합니다.',
    }),
    ApiOkResponse({ description: 'ReservationSlot 배열' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
  ],
];

export const ApiReservationSlotsListDocs = () =>
  composeMethodGroups(RESERVATION_SLOT_LIST_DECORATOR_GROUPS);

const RESERVATION_SLOT_UPDATE_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '예약 가능 시간대 수정(부스)',
      description:
        '**JWT 필수.** `PATCH /reservation-slots/{reservationSlotId}`. `startTime`, `endTime`, `availableTables`를 부분 수정합니다.',
    }),
    ApiParam({
      name: 'reservationSlotId',
      type: Number,
      example: 3,
      description: '예약 가능 시간대 PK (`ReservationSlot.id`)',
    }),
    ApiConsumes('application/json'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          startTime: {
            type: 'string',
            example: '10:30',
          },
          endTime: {
            type: 'string',
            example: '12:00',
          },
          availableTables: {
            type: 'integer',
            example: 10,
            minimum: 0,
          },
        },
      },
    }),
    ApiOkResponse({ description: '수정된 ReservationSlot' }),
    ApiBadRequestResponse({ description: '유효성 검사 실패' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
    ApiNotFoundResponse({
      description: '해당 스토어의 reservationSlotId를 찾지 못함',
    }),
  ],
];

export const ApiReservationSlotsUpdateDocs = () =>
  composeMethodGroups(RESERVATION_SLOT_UPDATE_DECORATOR_GROUPS);

const RESERVATION_SLOT_DELETE_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '예약 가능 시간대 삭제(부스)',
      description:
        '**JWT 필수.** `DELETE /reservation-slots/{reservationSlotId}`. 시간대를 실제 삭제합니다(연결된 예약자는 FK cascade로 함께 삭제).',
    }),
    ApiParam({
      name: 'reservationSlotId',
      type: Number,
      example: 3,
      description: '예약 가능 시간대 PK (`ReservationSlot.id`)',
    }),
    ApiOkResponse({ description: '삭제된 ReservationSlot' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
    ApiNotFoundResponse({
      description: '해당 스토어의 reservationSlotId를 찾지 못함',
    }),
  ],
];

export const ApiReservationSlotsDeleteDocs = () =>
  composeMethodGroups(RESERVATION_SLOT_DELETE_DECORATOR_GROUPS);

const RESERVATION_SLOT_RESERVATIONS_LIST_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '특정 시간대 예약자 목록(부스)',
      description:
        '**JWT 필수.** `GET /reservation-slots/{reservationSlotId}/reservations`. 로그인한 스토어(`JWT sub`)에 속한 해당 시간대의 예약자 목록만 조회합니다.',
    }),
    ApiParam({
      name: 'reservationSlotId',
      type: Number,
      example: 3,
      description: '예약 가능 시간대 PK (`ReservationSlot.id`)',
    }),
    ApiOkResponse({ description: 'Reservation 배열 (reservationSlot 포함)' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
    ApiNotFoundResponse({
      description: '해당 스토어의 reservationSlotId를 찾지 못함',
    }),
  ],
];

export const ApiReservationSlotReservationsListDocs = () =>
  composeMethodGroups(RESERVATION_SLOT_RESERVATIONS_LIST_DECORATOR_GROUPS);

const RESERVATION_CREATE_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '예약자 생성(부스)',
      description:
        '**JWT 필수.** 로그인한 스토어(`JWT sub`)의 예약 가능 시간대(`reservationSlotId`)에 예약자를 생성합니다.',
    }),
    ApiConsumes('application/json'),
    ApiBody(RESERVATION_CREATE_BODY),
    ApiCreatedResponse({
      description: '생성된 Reservation (reservationSlot 포함)',
    }),
    ApiBadRequestResponse({ description: '유효성 검사 실패' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
    ApiNotFoundResponse({
      description: '해당 스토어에 속한 reservationSlotId를 찾지 못함',
    }),
  ],
];

export const ApiReservationsCreateDocs = () =>
  composeMethodGroups(RESERVATION_CREATE_DECORATOR_GROUPS);

const RESERVATION_GET_ONE_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '예약자 단건 조회(부스)',
      description:
        '**JWT 필수.** `GET /reservations/{id}`. 로그인한 스토어(`JWT sub`) 소속이며 삭제되지 않은 예약자 1건을 조회합니다.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 12,
      description: '예약자 PK (`Reservation.id`)',
    }),
    ApiOkResponse({ description: 'Reservation 단건 (reservationSlot 포함)' }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
    ApiNotFoundResponse({
      description: '해당 스토어 예약자가 없거나 이미 삭제됨',
    }),
  ],
];

export const ApiReservationsGetOneDocs = () =>
  composeMethodGroups(RESERVATION_GET_ONE_DECORATOR_GROUPS);

const RESERVATION_DELETE_DECORATOR_GROUPS: DecoratorArg[][] = [
  [
    ApiOperation({
      summary: '예약자 삭제(부스, soft delete)',
      description:
        '**JWT 필수.** `DELETE /reservations/{id}`. 실제 삭제 대신 `Reservation.deleted=true`로 처리합니다.',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      example: 12,
      description: '예약자 PK (`Reservation.id`)',
    }),
    ApiOkResponse({
      description: 'soft delete 처리된 Reservation (reservationSlot 포함)',
    }),
    ApiUnauthorizedResponse({ description: 'JWT 없음/만료/무효' }),
    ApiNotFoundResponse({
      description: '해당 스토어 예약자가 없거나 이미 삭제됨',
    }),
  ],
];

export const ApiReservationsDeleteDocs = () =>
  composeMethodGroups(RESERVATION_DELETE_DECORATOR_GROUPS);
