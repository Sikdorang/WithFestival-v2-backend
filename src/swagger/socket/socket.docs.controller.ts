import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { STORE_SOCKET_EVENTS } from '../../notifications/notifications.events';
import {
  SocketDocsOrderItemCompletedChangedPayload,
  SocketDocsOrderRealtimePayload,
  SocketDocsReservationCreatedPayload,
  SocketDocsReservationRejectedPayload,
  SocketDocsWaitingCreatedPayload,
  SocketDocsWaitingStatusPayload,
} from './socket-payload.docs.dto';
import { SOCKET_SWAGGER_TAG } from './tag.constants';

const ORDER_EVENTS = [
  STORE_SOCKET_EVENTS.ORDER_CREATED,
  STORE_SOCKET_EVENTS.ORDER_PAYMENT_PAID,
  STORE_SOCKET_EVENTS.ORDER_STATUS_CANCELED,
  STORE_SOCKET_EVENTS.ORDER_STATUS_COMPLETED,
].join('`, `');

/**
 * HTTP 가 아닌 Socket.IO 페이로드 스키마를 Swagger 에 노출하기 위한 문서용 컨트롤러.
 * 각 GET 은 동일한 예시 JSON 을 반환합니다.
 */
@ApiTags(SOCKET_SWAGGER_TAG)
@Controller('_docs/socket-io')
export class SocketIoDocsController {
  @Get('payload-order-realtime')
  @ApiOperation({
    summary: '주문 계열 이벤트 페이로드 (공통)',
    description: `이벤트: \`${ORDER_EVENTS}\` — 서버가 \`emit(eventName, payload)\` 로 보내며 **페이로드 형태는 동일**합니다.`,
  })
  @ApiOkResponse({ type: SocketDocsOrderRealtimePayload })
  payloadOrderRealtime(): SocketDocsOrderRealtimePayload {
    return {
      orderId: 1,
      storeId: 3,
      tableId: 5,
      totalPrice: 9000,
      customerName: '홍길동',
      phoneNumber: '01012345678',
      status: 'RECEIVED',
      paymentStatus: 'PENDING',
      createdAt: '2026-05-10T12:00:00.000Z',
      items: [
        { id: 1, menuId: 10, price: 4500, quantity: 2, menuName: '떡볶이' },
      ],
    };
  }

  @Get('payload-order-item-completed-changed')
  @ApiOperation({
    summary: `\`${STORE_SOCKET_EVENTS.ORDER_ITEM_COMPLETED_CHANGED}\` 페이로드`,
    description:
      '`PATCH /orders/items/{itemId}/toggle-completed` 성공 후 동일 스토어 룸(`booth:{storeId}`)으로 발행됩니다. **풀 오더 대신 변경 델타만** 담아 클라이언트가 로컬 상태에 in-place 패치 가능합니다.',
  })
  @ApiOkResponse({ type: SocketDocsOrderItemCompletedChangedPayload })
  payloadOrderItemCompletedChanged(): SocketDocsOrderItemCompletedChangedPayload {
    return {
      orderId: 1,
      storeId: 3,
      itemId: 23,
      completed: true,
      changedAt: '2026-05-25T19:43:12.345Z',
    };
  }

  @Get('payload-waiting-created')
  @ApiOperation({
    summary: '`waiting.created` 페이로드',
  })
  @ApiOkResponse({ type: SocketDocsWaitingCreatedPayload })
  payloadWaitingCreated(): SocketDocsWaitingCreatedPayload {
    return {
      waitingId: 72,
      storeId: 3,
      name: '김토끼',
      phoneNumber: '01012345678',
      partySize: 4,
      status: 'WAITING',
      createdAt: '2026-05-10T11:00:00.000Z',
    };
  }

  @Get('payload-waiting-status')
  @ApiOperation({
    summary: '`waiting.status.canceled` · `waiting.status.entered` 페이로드',
    description:
      '`waiting.created` 필드에 `updatedAt`(ISO 문자열)이 추가됩니다.',
  })
  @ApiOkResponse({ type: SocketDocsWaitingStatusPayload })
  payloadWaitingStatus(): SocketDocsWaitingStatusPayload {
    return {
      waitingId: 72,
      storeId: 3,
      name: '김토끼',
      phoneNumber: '01012345678',
      partySize: 4,
      status: 'CANCELED',
      createdAt: '2026-05-10T11:00:00.000Z',
      updatedAt: '2026-05-10T11:15:00.000Z',
    };
  }

  @Get('payload-reservation-created')
  @ApiOperation({
    summary: '`reservation.created` 페이로드',
  })
  @ApiOkResponse({ type: SocketDocsReservationCreatedPayload })
  payloadReservationCreated(): SocketDocsReservationCreatedPayload {
    return {
      reservationId: 40,
      storeId: 3,
      reservationSlotId: 7,
      slotStartTime: '18:00',
      slotEndTime: '20:00',
      reserverName: '이매장',
      phoneNumber: '01011112222',
      partySize: 2,
      createdAt: '2026-05-10T10:00:00.000Z',
    };
  }

  @Get('payload-reservation-rejected')
  @ApiOperation({
    summary: '`reservation.rejected` 페이로드',
    description: '스태프 예약 거절(소프트 삭제) 시 브로드캐스트됩니다.',
  })
  @ApiOkResponse({ type: SocketDocsReservationRejectedPayload })
  payloadReservationRejected(): SocketDocsReservationRejectedPayload {
    return {
      reservationId: 40,
      storeId: 3,
      reservationSlotId: 7,
      slotStartTime: '18:00',
      slotEndTime: '20:00',
      rejectedAt: '2026-05-10T10:30:00.000Z',
    };
  }
}
