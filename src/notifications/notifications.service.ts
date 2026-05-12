import { Injectable, Logger } from '@nestjs/common';
import {
  BOOTH_NOTIFICATION_EVENTS,
  type StoreSocketEventName,
} from './notifications.events';
import { NotificationsGateway } from './notifications.gateway';
import {
  type OrderCreatedEvent,
  type OrderCreatedItemEvent,
} from './dto/order-created-event.dto';
import {
  WaitingCreatedEvent,
  WaitingStatusChangedPayload,
} from './dto/waiting-created-event.dto';
import type {
  ReservationCreatedSocketPayload,
  ReservationRejectedSocketPayload,
} from './dto/reservation-socket.dto';

type OrderWithItems = {
  id: number;
  storeId: number;
  tableId: number;
  totalPrice: number;
  customerName: string | null;
  phoneNumber: string | null;
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
  updatedAt: Date;
};

type ReservationWireRow = {
  id: number;
  reservationSlotId: number;
  reserverName: string;
  phoneNumber: string;
  partySize: number;
  createdAt: Date;
  reservationSlot: {
    storeId: number;
    startTime: string;
    endTime: string;
  };
};

type ReservationRejectedRow = ReservationWireRow & { updatedAt: Date };

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  emitToBooth(boothId: number, event: StoreSocketEventName, payload: unknown): void {
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
    const payload: WaitingCreatedEvent = this.buildWaitingPayload(waiting);

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

  emitWaitingCanceled(waiting: WaitingRow): void {
    this.emitWaitingStatus(waiting, BOOTH_NOTIFICATION_EVENTS.WAITING_STATUS_CANCELED);
  }

  emitWaitingEntered(waiting: WaitingRow): void {
    this.emitWaitingStatus(waiting, BOOTH_NOTIFICATION_EVENTS.WAITING_STATUS_ENTERED);
  }

  emitOrderStatusCanceled(order: OrderWithItems): void {
    this.emitOrderWithPayload(
      order,
      BOOTH_NOTIFICATION_EVENTS.ORDER_STATUS_CANCELED,
      'order.status.canceled',
    );
  }

  emitOrderStatusCompleted(order: OrderWithItems): void {
    this.emitOrderWithPayload(
      order,
      BOOTH_NOTIFICATION_EVENTS.ORDER_STATUS_COMPLETED,
      'order.status.completed',
    );
  }

  emitReservationCreated(reservation: ReservationWireRow): void {
    const slot = reservation.reservationSlot;
    const payload: ReservationCreatedSocketPayload = {
      reservationId: reservation.id,
      storeId: slot.storeId,
      reservationSlotId: reservation.reservationSlotId,
      slotStartTime: slot.startTime,
      slotEndTime: slot.endTime,
      reserverName: reservation.reserverName,
      phoneNumber: reservation.phoneNumber,
      partySize: reservation.partySize,
      createdAt: reservation.createdAt.toISOString(),
    };

    try {
      this.emitToBooth(slot.storeId, BOOTH_NOTIFICATION_EVENTS.RESERVATION_CREATED, payload);
    } catch (error) {
      this.logger.warn(
        `Failed to emit reservation.created for reservation ${reservation.id}: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }
  }

  emitReservationRejected(reservation: ReservationRejectedRow): void {
    const slot = reservation.reservationSlot;
    const payload: ReservationRejectedSocketPayload = {
      reservationId: reservation.id,
      storeId: slot.storeId,
      reservationSlotId: reservation.reservationSlotId,
      slotStartTime: slot.startTime,
      slotEndTime: slot.endTime,
      rejectedAt: reservation.updatedAt.toISOString(),
    };

    try {
      this.emitToBooth(slot.storeId, BOOTH_NOTIFICATION_EVENTS.RESERVATION_REJECTED, payload);
    } catch (error) {
      this.logger.warn(
        `Failed to emit reservation.rejected for reservation ${reservation.id}: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }
  }

  private emitOrderWithPayload(
    order: OrderWithItems,
    event: StoreSocketEventName,
    eventLabel: string,
  ): void {
    const payload = this.buildOrderCreatedPayload(order);
    try {
      this.emitToBooth(order.storeId, event, payload);
    } catch (error) {
      this.logger.warn(
        `Failed to emit ${eventLabel} for order ${order.id}: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }
  }

  private emitWaitingStatus(waiting: WaitingRow, event: StoreSocketEventName): void {
    const base = this.buildWaitingPayload(waiting);
    const payload: WaitingStatusChangedPayload = {
      ...base,
      updatedAt: waiting.updatedAt.toISOString(),
    };

    try {
      this.emitToBooth(waiting.storeId, event, payload);
    } catch (err) {
      this.logger.warn(
        `Failed to emit ${event} for waiting ${waiting.id}: ${
          err instanceof Error ? err.message : 'unknown error'
        }`,
      );
    }
  }

  private buildWaitingPayload(waiting: WaitingRow): WaitingCreatedEvent {
    return {
      waitingId: waiting.id,
      storeId: waiting.storeId,
      name: waiting.name,
      phoneNumber: waiting.phoneNumber,
      partySize: waiting.partySize,
      status: waiting.status,
      createdAt: waiting.createdAt.toISOString(),
    };
  }

  private buildOrderCreatedPayload(order: OrderWithItems): OrderCreatedEvent {
    return {
      orderId: order.id,
      storeId: order.storeId,
      tableId: order.tableId,
      totalPrice: order.totalPrice,
      customerName: order.customerName,
      phoneNumber: order.phoneNumber,
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
