export type WaitingCreatedEvent = {
  waitingId: number;
  storeId: number;
  name: string;
  phoneNumber: string | null;
  partySize: number;
  status: string;
  createdAt: string;
};

/** `waiting.status.canceled` · `waiting.status.entered` */
export type WaitingStatusChangedPayload = WaitingCreatedEvent & {
  updatedAt: string;
};
