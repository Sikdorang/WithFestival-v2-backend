import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreAccountNumberDto } from './dto/update-store-account-number.dto';
import { UpdateStoreEventDto } from './dto/update-store-event.dto';
import { UpdateStoreNameDto } from './dto/update-store-name.dto';
import { UpdateStoreNoticeDto } from './dto/update-store-notice.dto';
import { UpdateStoreMissionsEnabledDto } from './dto/update-store-missions-enabled.dto';
import { UpdateStoreReservationEnabledDto } from './dto/update-store-reservation-enabled.dto';

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateStoreDto) {
    return this.prisma.store.create({
      data: {
        name: dto.name,
        accountNumber: dto.accountNumber,
        notice: dto.notice,
        event: dto.event,
        reservationEnabled: false,
        missionsEnabled: false,
        authCode: dto.authCode,
      },
    });
  }

  updateName(id: number, dto: UpdateStoreNameDto) {
    return this.updateStoreOrThrow(id, { name: dto.name });
  }

  updateAccountNumber(id: number, dto: UpdateStoreAccountNumberDto) {
    return this.updateStoreOrThrow(id, {
      accountNumber: dto.accountNumber,
    });
  }

  updateNotice(id: number, dto: UpdateStoreNoticeDto) {
    return this.updateStoreOrThrow(id, { notice: dto.notice });
  }

  updateEvent(id: number, dto: UpdateStoreEventDto) {
    return this.updateStoreOrThrow(id, { event: dto.event });
  }

  updateReservationEnabled(id: number, dto: UpdateStoreReservationEnabledDto) {
    return this.updateStoreOrThrow(id, {
      reservationEnabled: dto.reservationEnabled,
    });
  }

  updateMissionsEnabled(id: number, dto: UpdateStoreMissionsEnabledDto) {
    return this.updateStoreOrThrow(id, {
      missionsEnabled: dto.missionsEnabled,
    });
  }

  private async updateStoreOrThrow(id: number, data: Prisma.StoreUpdateInput) {
    try {
      return await this.prisma.store.update({ where: { id }, data });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`Store ${id} not found`);
      }
      throw e;
    }
  }
}
