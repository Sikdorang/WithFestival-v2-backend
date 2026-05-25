import { ApiProperty } from '@nestjs/swagger';

/** `order.created` 등 주문 계열 라인 아이템 */
export class SocketDocsOrderLineItem {
  @ApiProperty({ example: 1 }) id!: number;

  @ApiProperty({ example: 10 }) menuId!: number;

  @ApiProperty({ example: 4500 }) price!: number;

  @ApiProperty({ example: 2 }) quantity!: number;

  @ApiProperty({ required: false, example: '떡볶이', description: '조인 가능할 때 포함' })
  menuName?: string;
}

/** `order.created`, `order.payment.paid`, `order.status.canceled`, `order.status.completed` 공통 바디 */
export class SocketDocsOrderRealtimePayload {
  @ApiProperty({ example: 1 }) orderId!: number;

  @ApiProperty({ example: 3 }) storeId!: number;

  @ApiProperty({ example: 5 }) tableId!: number;

  @ApiProperty({ example: 9000 }) totalPrice!: number;

  @ApiProperty({
    nullable: true,
    type: String,
    example: '홍길동',
    description: '입금자/고객명',
  })
  customerName!: string | null;

  @ApiProperty({
    nullable: true,
    type: String,
    example: '01012345678',
    description: '주문자 전화번호',
  })
  phoneNumber!: string | null;

  @ApiProperty({ example: 'RECEIVED', description: '주문 상태' })
  status!: string;

  @ApiProperty({ example: 'PENDING', description: '결제 상태' })
  paymentStatus!: string;

  @ApiProperty({
    description: '`Order.createdAt` ISO 문자열',
    example: '2026-05-10T12:00:00.000Z',
  })
  createdAt!: string;

  @ApiProperty({ type: SocketDocsOrderLineItem, isArray: true }) items!: SocketDocsOrderLineItem[];
}

/** `order.item.completed.changed` — 풀 오더 대신 변경 델타만 담는 가벼운 페이로드 */
export class SocketDocsOrderItemCompletedChangedPayload {
  @ApiProperty({ example: 1, description: '변경된 품목이 속한 주문 PK' })
  orderId!: number;

  @ApiProperty({ example: 3, description: '부스(스토어) PK — 룸 식별과 동일' })
  storeId!: number;

  @ApiProperty({ example: 23, description: '변경된 품목 PK (`OrderItem.id`)' })
  itemId!: number;

  @ApiProperty({
    example: true,
    description: '토글 후 새 값(true=완료, false=미완료)',
  })
  completed!: boolean;

  @ApiProperty({
    example: '2026-05-25T19:43:12.345Z',
    description: '변경 시각(ISO 8601)',
  })
  changedAt!: string;
}

export class SocketDocsWaitingCreatedPayload {
  @ApiProperty({ example: 72 }) waitingId!: number;

  @ApiProperty({ example: 3 }) storeId!: number;

  @ApiProperty({ example: '김토끼' }) name!: string;

  @ApiProperty({ nullable: true, type: String, example: '01012345678' })
  phoneNumber!: string | null;

  @ApiProperty({ example: 4 }) partySize!: number;

  @ApiProperty({ example: 'WAITING' }) status!: string;

  @ApiProperty({ example: '2026-05-10T11:00:00.000Z' }) createdAt!: string;
}

export class SocketDocsWaitingStatusPayload extends SocketDocsWaitingCreatedPayload {
  @ApiProperty({
    description: '상태 변경 시각',
    example: '2026-05-10T11:15:00.000Z',
  })
  updatedAt!: string;
}

export class SocketDocsReservationCreatedPayload {
  @ApiProperty({ example: 40 }) reservationId!: number;

  @ApiProperty({ example: 3 }) storeId!: number;

  @ApiProperty({ example: 7 }) reservationSlotId!: number;

  @ApiProperty({ example: '18:00' }) slotStartTime!: string;

  @ApiProperty({ example: '20:00' }) slotEndTime!: string;

  @ApiProperty({ example: '이매장' }) reserverName!: string;

  @ApiProperty({ example: '01011112222' }) phoneNumber!: string;

  @ApiProperty({ example: 2 }) partySize!: number;

  @ApiProperty({ example: '2026-05-10T10:00:00.000Z' }) createdAt!: string;
}

export class SocketDocsReservationRejectedPayload {
  @ApiProperty({ example: 40 }) reservationId!: number;

  @ApiProperty({ example: 3 }) storeId!: number;

  @ApiProperty({ example: 7 }) reservationSlotId!: number;

  @ApiProperty({ example: '18:00' }) slotStartTime!: string;

  @ApiProperty({ example: '20:00' }) slotEndTime!: string;

  @ApiProperty({
    description: '거절(소프트 삭제) 시각',
    example: '2026-05-10T10:30:00.000Z',
  })
  rejectedAt!: string;
}
