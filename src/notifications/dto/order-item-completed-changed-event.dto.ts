/**
 * 소켓 이벤트: `order.item.completed.changed`
 *
 * 개별 `OrderItem.completed` 값이 토글된 직후 동일 스토어(`booth:{storeId}`)
 * 룸으로 브로드캐스트됩니다. 풀 오더 대신 **변경 델타**만 담아 다른
 * 사용자의 로컬 상태를 한 줄로 갱신할 수 있게 합니다.
 */
export type OrderItemCompletedChangedEvent = {
  /** 변경된 품목이 속한 주문 PK (`Order.id`) */
  orderId: number;
  /** 부스(스토어) PK (`Store.id`) — 룸 식별과 동일 값 */
  storeId: number;
  /** 변경된 품목 PK (`OrderItem.id`) */
  itemId: number;
  /** 토글 후 새 값 */
  completed: boolean;
  /** 변경 시각(ISO 8601) */
  changedAt: string;
};
