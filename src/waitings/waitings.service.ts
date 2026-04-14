import { Injectable, NotFoundException } from '@nestjs/common';
import { WaitingStatus } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWaitingDto } from './dto/create-waiting.dto';

@Injectable()
export class WaitingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authCode: string, dto: CreateWaitingDto) {
    const store = await this.prisma.store.findUnique({
      where: { authCode },
    });
    if (!store) {
      throw new NotFoundException('Store not found for this authCode');
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
