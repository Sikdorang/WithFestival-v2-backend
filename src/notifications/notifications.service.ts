import { Injectable, Logger } from '@nestjs/common';
import { BoothNotificationEventName, BOOTH_NOTIFICATION_EVENTS } from './notifications.events';
import { NotificationsGateway } from './notifications.gateway';
import {
  type OrderCreatedEvent,
  type OrderCreatedItemEvent,
} from './dto/order-created-event.dto';
import { WaitingCreatedEvent } from './dto/waiting-created-event.dto';

type OrderWithItems = {
  id: number;
  storeId: number;
  tableId: number;
  totalPrice: number;
  customerName: string | null;
  status: string;
  paymentStatus: string;
  createdAt: Date;
  items: Array<{
    id: number;
    menuId: number;
    price: number;
    quantity: number;
    menu?: { id: number; name: string };
  }>;
};

type WaitingRow = {
  id: number;
  storeId: number;
  name: string;
  phoneNumber: string | null;
  partySize: number;
  status: string;
  createdAt: Date;
};

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  emitToBooth(
    boothId: number,
    event: BoothNotificationEventName,
    payload: unknown,
  ): void {
    this.notificationsGateway.emitToStore(boothId, event, payload);
  }

  emitOrderCreated(order: OrderWithItems): void {
    const payload = this.buildOrderCreatedPayload(order);

    try {
      this.emitToBooth(
        order.storeId,
        BOOTH_NOTIFICATION_EVENTS.ORDER_CREATED,
        payload,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to emit order.created for order ${order.id}: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }
  }

  emitOrderPaymentPaid(order: OrderWithItems): void {
    const payload = this.buildOrderCreatedPayload(order);

    try {
      this.emitToBooth(
        order.storeId,
        BOOTH_NOTIFICATION_EVENTS.ORDER_PAYMENT_PAID,
        payload,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to emit order.payment.paid for order ${order.id}: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }
  }

  emitWaitingCreated(waiting: WaitingRow): void {
    const payload: WaitingCreatedEvent = {
      waitingId: waiting.id,
      storeId: waiting.storeId,
      name: waiting.name,
      phoneNumber: waiting.phoneNumber,
      partySize: waiting.partySize,
      status: waiting.status,
      createdAt: waiting.createdAt.toISOString(),
    };

    try {
      this.emitToBooth(
        waiting.storeId,
        BOOTH_NOTIFICATION_EVENTS.WAITING_CREATED,
        payload,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to emit waiting.created for waiting ${waiting.id}: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }
  }

  private buildOrderCreatedPayload(order: OrderWithItems): OrderCreatedEvent {
    return {
      orderId: order.id,
      storeId: order.storeId,
      tableId: order.tableId,
      totalPrice: order.totalPrice,
      customerName: order.customerName,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item): OrderCreatedItemEvent => {
        const row: OrderCreatedItemEvent = {
          id: item.id,
          menuId: item.menuId,
          price: item.price,
          quantity: item.quantity,
        };
        if (item.menu?.name != null) {
          row.menuName = item.menu.name;
        }
        return row;
      }),
    };
  }
}
