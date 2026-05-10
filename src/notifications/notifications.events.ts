/**
 * 소켓 브로드캐스트 이벤트 (Socket.IO)
 *
 * ## 룸
 * - 수신: `booth:{storeId}` (기존 명칭 유지, 값은 `Store.id`)
 * - 연결: JWT `auth.token` 또는 `handshake.auth.boothId` / `query.boothId`
 *
 * ## 이벤트 목록
 *
 * | 구분 | 이벤트 | 트리거 |
 * |------|--------|--------|
 * | 주문 | `order.created` | 고객 `POST /orders` |
 * | 주문 | `order.payment.paid` | 부스 `PATCH …/payment/paid` |
 * | 주문 | `order.status.canceled` | 부스 `PATCH …/status/cancelled` |
 * | 주문 | `order.status.completed` | 부스 `PATCH …/status/completed` |
 * | 웨이팅 | `waiting.created` | 고객 줄서기 생성 |
 * | 웨이팅 | `waiting.status.canceled` | 부스 WAITING 상태 → CANCELED |
 * | 웨이팅 | `waiting.status.entered` | 부스 WAITING → ENTERED (입장·완료 처리) |
 * | 예약 | `reservation.created` | 고객 또는 부스 예약 신청 성공 시 |
 * | 예약 | `reservation.rejected` | 부스 예약 거절(소프트 삭제) 시 |
 */

export const STORE_SOCKET_EVENTS = {
  ORDER_CREATED: 'order.created',
  ORDER_PAYMENT_PAID: 'order.payment.paid',
  ORDER_STATUS_CANCELED: 'order.status.canceled',
  ORDER_STATUS_COMPLETED: 'order.status.completed',

  WAITING_CREATED: 'waiting.created',
  WAITING_STATUS_CANCELED: 'waiting.status.canceled',
  WAITING_STATUS_ENTERED: 'waiting.status.entered',

  RESERVATION_CREATED: 'reservation.created',
  RESERVATION_REJECTED: 'reservation.rejected',
} as const;

/** 하위 호환 — 기존 코드에서 사용 */
export const BOOTH_NOTIFICATION_EVENTS = STORE_SOCKET_EVENTS;

export type StoreSocketEventName =
  (typeof STORE_SOCKET_EVENTS)[keyof typeof STORE_SOCKET_EVENTS];

/** @deprecated `StoreSocketEventName` 사용 */
export type BoothNotificationEventName = StoreSocketEventName;
