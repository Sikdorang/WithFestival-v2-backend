export const BOOTH_NOTIFICATION_EVENTS = {
  ORDER_CREATED: 'order.created',
  ORDER_PAYMENT_PAID: 'order.payment.paid',
  WAITING_CREATED: 'waiting.created',
} as const;

export type BoothNotificationEventName =
  (typeof BOOTH_NOTIFICATION_EVENTS)[keyof typeof BOOTH_NOTIFICATION_EVENTS];
