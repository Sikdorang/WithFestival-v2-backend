import { Injectable, NotFoundException } from '@nestjs/common';
import { WaitingStatus } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWaitingDto } from './dto/create-waiting.dto';
import { UpdateWaitingStatusDto } from './dto/update-waiting-status.dto';

@Injectable()
export class WaitingsService {
  constructor(private readonly prisma: PrismaService) {}

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
    return this.prisma.waiting.update({
      where: { id: waitingId },
      data: { status: dto.status },
    });
  }

  async create(storeId: number, dto: CreateWaitingDto) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!store) {
      throw new NotFoundException('Store not found for this storeId');
    }

    return this.prisma.waiting.create({
      data: {
        storeId: store.id,
        name: dto.name,
        phoneNumber: dto.phoneNumber,
        partySize: dto.partySize,
        status: WaitingStatus.WAITING,
      },
    });
  }
}
