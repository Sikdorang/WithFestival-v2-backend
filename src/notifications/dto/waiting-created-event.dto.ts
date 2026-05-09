export type WaitingCreatedEvent = {
  waitingId: number;
  storeId: number;
  name: string;
  phoneNumber: string | null;
  partySize: number;
  status: string;
  createdAt: string;
};
