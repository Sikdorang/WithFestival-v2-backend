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
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

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
    return this.prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: PaymentStatus.PAID },
      include: { items: true },
    });
  }

  async setPaymentFailed(storeId: number, orderId: number) {
    await this.assertOrderInStore(storeId, orderId);
    return this.prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: PaymentStatus.FAILED },
      include: { items: true },
    });
  }

  async setStatusCanceled(storeId: number, orderId: number) {
    await this.assertOrderInStore(storeId, orderId);
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELED },
      include: { items: true },
    });
  }

  async setStatusCompleted(storeId: number, orderId: number) {
    await this.assertOrderInStore(storeId, orderId);
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.COMPLETED },
      include: { items: true },
    });
  }

  /**
   * JWT 스토어 기준 주문 단위 목록(최신순), 품목 포함.
   * @param paid `true`: 입금 확인됨(PAID)이면서 아직 완료/취소 전. `false`: PAID가 아닌 주문.
   */
  listByStore(storeId: number, paid: boolean) {
    const orderBy = { createdAt: 'desc' as const };
    const include = { items: true as const };

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
        include,
      });
    }

    return this.prisma.order.findMany({
      where: {
        storeId,
        paymentStatus: { not: PaymentStatus.PAID },
      },
      orderBy,
      include,
    });
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

    return this.prisma.order.create({
      data: {
        storeId,
        tableId,
        totalPrice: dto.totalPrice,
        customerName: dto.depositorName,
        status: 'RECEIVED',
        paymentStatus: 'PENDING',
        items: { create: createLines },
      },
      include: { items: true },
    });
  }
}
