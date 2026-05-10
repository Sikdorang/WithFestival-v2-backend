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
import { UpdateStoreReservationReminderSmsDto } from './dto/update-store-reservation-reminder-sms.dto';
import { UpdateStoreWaitingsEnabledDto } from './dto/update-store-waitings-enabled.dto';

/** 고객·프론트용 스토어 공개 정보 (`authCode` 등 비밀은 제외) */
export type StorePublicInfo = {
  id: number;
  name: string;
  accountNumber: string | null;
  notice: string | null;
  event: string | null;
  reservationEnabled: boolean;
  reservationRemindSms5MinBefore: boolean;
  reservationRemindSms10MinBefore: boolean;
  missionsEnabled: boolean;
  waitingsEnabled: boolean;
  createdAt: Date;
};

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicInfo(storeId: number): Promise<StorePublicInfo> {
    const row = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: {
        id: true,
        name: true,
        accountNumber: true,
        notice: true,
        event: true,
        reservationEnabled: true,
        reservationRemindSms5MinBefore: true,
        reservationRemindSms10MinBefore: true,
        missionsEnabled: true,
        waitingsEnabled: true,
        createdAt: true,
      },
    });
    if (!row) {
      throw new NotFoundException(`Store ${storeId} not found`);
    }
    return row;
  }

  create(dto: CreateStoreDto) {
    return this.prisma.store.create({
      data: {
        name: dto.name,
        accountNumber: dto.accountNumber,
        notice: dto.notice,
        event: dto.event,
        reservationEnabled: false,
        missionsEnabled: false,
        waitingsEnabled: false,
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

  updateWaitingsEnabled(id: number, dto: UpdateStoreWaitingsEnabledDto) {
    return this.updateStoreOrThrow(id, {
      waitingsEnabled: dto.waitingsEnabled,
    });
  }

  updateReservationReminderSms(
    id: number,
    dto: UpdateStoreReservationReminderSmsDto,
  ) {
    return this.updateStoreOrThrow(id, {
      reservationRemindSms5MinBefore: dto.remind5MinBefore,
      reservationRemindSms10MinBefore: dto.remind10MinBefore,
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
