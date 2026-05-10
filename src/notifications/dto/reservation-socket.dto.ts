/** `reservation.created` 페이로드 */
export type ReservationCreatedSocketPayload = {
  reservationId: number;
  storeId: number;
  reservationSlotId: number;
  slotStartTime: string;
  slotEndTime: string;
  reserverName: string;
  phoneNumber: string;
  partySize: number;
  createdAt: string;
};

/** `reservation.rejected` 페이로드 — 스태프 소프트 삭제 시 */
export type ReservationRejectedSocketPayload = {
  reservationId: number;
  storeId: number;
  reservationSlotId: number;
  slotStartTime: string;
  slotEndTime: string;
  /** 거절(소프트 삭제) 시각 */
  rejectedAt: string;
};
