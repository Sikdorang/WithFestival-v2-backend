import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OrderStatus,
  PaymentStatus,
  Prisma,
} from '../../generated/prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicOrderDto } from './dto/create-public-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';

const ORDER_DETAIL_INCLUDE = {
  items: {
    include: {
      menu: { select: { id: true, name: true } },
    },
  },
} satisfies Prisma.OrderInclude;

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  private async assertOrderInStore(
    storeId: number,
    orderId: number,
  ): Promise<void> {
    const row = await this.prisma.order.findFirst({
      where: { id: orderId, storeId },
      select: { id: true },
    });
    if (!row) {
      throw new NotFoundException('Order not found for this store');
    }
  }

  async setPaymentPaid(storeId: number, orderId: number) {
    await this.assertOrderInStore(storeId, orderId);
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: PaymentStatus.PAID },
      include: ORDER_DETAIL_INCLUDE,
    });

    this.notificationsService.emitOrderPaymentPaid(order);

    return order;
  }

  async setPaymentFailed(storeId: number, orderId: number) {
    await this.assertOrderInStore(storeId, orderId);
    return this.prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: PaymentStatus.FAILED },
      include: ORDER_DETAIL_INCLUDE,
    });
  }

  async setStatusCanceled(storeId: number, orderId: number) {
    await this.assertOrderInStore(storeId, orderId);
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELED },
      include: ORDER_DETAIL_INCLUDE,
    });

    this.notificationsService.emitOrderStatusCanceled(order);

    return order;
  }

  async setStatusCompleted(storeId: number, orderId: number) {
    await this.assertOrderInStore(storeId, orderId);
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.COMPLETED },
      include: ORDER_DETAIL_INCLUDE,
    });

    this.notificationsService.emitOrderStatusCompleted(order);

    return order;
  }

  /**
   * 주문 품목(`OrderItem`) 완료 상태 토글.
   * - 프론트는 `itemId`만 전달; 소속 주문/스토어는 서버가 조회·검증
   * - JWT `storeId`와 일치하지 않으면 **404**(타 스토어 품목 정보 누출 방지)
   * - 현재 값의 반대로 갱신하며 `Order.status`는 건드리지 않음
   */
  async toggleItemCompleted(storeId: number, itemId: number) {
    const existing = await this.prisma.orderItem.findUnique({
      where: { id: itemId },
      select: {
        id: true,
        completed: true,
        order: { select: { id: true, storeId: true } },
      },
    });
    if (!existing || existing.order.storeId !== storeId) {
      throw new NotFoundException('Order item not found for this store');
    }

    await this.prisma.orderItem.update({
      where: { id: itemId },
      data: { completed: !existing.completed },
    });

    return this.prisma.order.findUniqueOrThrow({
      where: { id: existing.order.id },
      include: ORDER_DETAIL_INCLUDE,
    });
  }

  /**
   * JWT 스토어 기준 주문 단위 목록(최신순), 품목 포함.
   * @param paid `true`: 입금 확인됨(PAID)이면서 아직 완료/취소 전. `false`: PAID가 아니면서 취소되지 않은 주문.
   */
  listByStore(storeId: number, paid: boolean) {
    const orderBy = { createdAt: 'desc' as const };
    if (paid) {
      return this.prisma.order.findMany({
        where: {
          storeId,
          paymentStatus: PaymentStatus.PAID,
          status: {
            notIn: [OrderStatus.COMPLETED, OrderStatus.CANCELED],
          },
        },
        orderBy,
        include: ORDER_DETAIL_INCLUDE,
      });
    }

    return this.prisma.order.findMany({
      where: {
        storeId,
        paymentStatus: { not: PaymentStatus.PAID },
        status: { not: OrderStatus.CANCELED },
      },
      orderBy,
      include: ORDER_DETAIL_INCLUDE,
    });
  }

  /**
   * JWT 스토어 기준 전체 주문(결제·처리 상태 무관), 최신순, 품목 포함.
   */
  listAllByStore(storeId: number) {
    return this.prisma.order.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      include: ORDER_DETAIL_INCLUDE,
    });
  }

  /** JWT 없이 본문의 `storeId`·`boothId`·`tableId`로 주문 (부스 PK는 현재 `Store.id` 한 종류) */
  async createFromPublicDto(dto: CreatePublicOrderDto) {
    if (dto.storeId !== dto.boothId) {
      throw new BadRequestException(
        'storeId와 boothId는 같은 값이어야 합니다(현재 가게·부스는 동일 PK `Store.id`).',
      );
    }

    const store = await this.prisma.store.findUnique({
      where: { id: dto.storeId },
      select: { id: true },
    });
    if (!store) {
      throw new NotFoundException(`Store ${dto.storeId} not found`);
    }

    const { storeId, boothId, tableId, ...rest } = dto;
    void boothId;
    return this.createForStore(storeId, tableId, rest);
  }

  async createForStore(storeId: number, tableId: number, dto: CreateOrderDto) {
    const menuIds = [...new Set(dto.items.map((i) => i.menuId))];
    const menus = await this.prisma.menu.findMany({
      where: {
        id: { in: menuIds },
        storeId,
        deleted: false,
      },
      select: { id: true },
    });
    const allowed = new Set(menus.map((m) => m.id));
    const missing = menuIds.filter((id) => !allowed.has(id));
    if (missing.length) {
      throw new BadRequestException(
        `Invalid or inactive menuId for this store: ${missing.join(', ')}`,
      );
    }

    const createLines: Prisma.OrderItemCreateManyOrderInput[] = dto.items.map(
      (row): Prisma.OrderItemCreateManyOrderInput => ({
        menuId: row.menuId,
        price: row.price,
        quantity: row.quantity,
      }),
    );

    const order = await this.prisma.order.create({
      data: {
        storeId,
        tableId,
        totalPrice: dto.totalPrice,
        customerName: dto.depositorName,
        phoneNumber: dto.phoneNumber,
        status: 'RECEIVED',
        paymentStatus: 'PENDING',
        items: { create: createLines },
      },
      include: ORDER_DETAIL_INCLUDE,
    });

    this.notificationsService.emitOrderCreated(order);

    return order;
  }
}
