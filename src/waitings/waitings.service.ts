import { Injectable, NotFoundException } from '@nestjs/common';
import { WaitingStatus } from '../../generated/prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWaitingDto } from './dto/create-waiting.dto';
import { UpdateWaitingStatusDto } from './dto/update-waiting-status.dto';

@Injectable()
export class WaitingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /** ENTERED·CANCELED가 아닌 건만 = WAITING(줄 대기 중) */
  async listActiveForStore(storeId: number) {
    return this.prisma.waiting.findMany({
      where: {
        storeId,
        status: { notIn: [WaitingStatus.ENTERED, WaitingStatus.CANCELED] },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * 입장(ENTERED)·취소(CANCELED) 처리되지 않은 대기 팀 수(고객용 공개).
   * `listActiveForStore`와 동일한 필터.
   */
  async countActiveForStore(storeId: number): Promise<{ count: number }> {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });
    if (!store) {
      throw new NotFoundException('Store not found for this storeId');
    }

    const count = await this.prisma.waiting.count({
      where: {
        storeId,
        status: { notIn: [WaitingStatus.ENTERED, WaitingStatus.CANCELED] },
      },
    });

    return { count };
  }

  async updateStatus(
    storeId: number,
    waitingId: number,
    dto: UpdateWaitingStatusDto,
  ) {
    const row = await this.prisma.waiting.findFirst({
      where: { id: waitingId, storeId },
    });
    if (!row) {
      throw new NotFoundException('Waiting not found for this store');
    }
    const updated = await this.prisma.waiting.update({
      where: { id: waitingId },
      data: { status: dto.status },
    });

    if (dto.status === WaitingStatus.CANCELED) {
      this.notificationsService.emitWaitingCanceled(updated);
    } else if (dto.status === WaitingStatus.ENTERED) {
      this.notificationsService.emitWaitingEntered(updated);
    }

    return updated;
  }

  async create(storeId: number, dto: CreateWaitingDto) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!store) {
      throw new NotFoundException('Store not found for this storeId');
    }

    const waiting = await this.prisma.waiting.create({
      data: {
        storeId: store.id,
        name: dto.name,
        phoneNumber: dto.phoneNumber,
        partySize: dto.partySize,
        status: WaitingStatus.WAITING,
      },
    });

    this.notificationsService.emitWaitingCreated(waiting);

    return waiting;
  }
}
