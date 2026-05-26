import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TranslationService } from '../translation/translation.service';
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
  noticeEn: string | null;
  noticeZh: string | null;
  noticeJa: string | null;
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly translation: TranslationService,
  ) {}

  async getPublicInfo(storeId: number): Promise<StorePublicInfo> {
    const row = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: {
        id: true,
        name: true,
        accountNumber: true,
        notice: true,
        noticeEn: true,
        noticeZh: true,
        noticeJa: true,
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

  async create(dto: CreateStoreDto) {
    const noticeKo = pickOrNull(dto.notice);
    const translated = await this.translation.translateText(noticeKo);
    return this.prisma.store.create({
      data: {
        name: dto.name,
        accountNumber: dto.accountNumber,
        notice: noticeKo,
        noticeEn: translated.en,
        noticeZh: translated.zh,
        noticeJa: translated.ja,
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

  /**
   * 공지(한국어 본문)를 갱신하면서 영/중/일 자동 번역값을 함께 저장합니다.
   * - `dto.notice`가 빈 문자열·undefined이면 모든 언어 컬럼을 `null`로 정리합니다.
   * - 번역 실패/키 미설정 시에는 한국어만 저장하고 다국어 컬럼은 `null`로 폴백합니다.
   */
  async updateNotice(id: number, dto: UpdateStoreNoticeDto) {
    const noticeKo = pickOrNull(dto.notice);
    const translated = await this.translation.translateText(noticeKo);
    return this.updateStoreOrThrow(id, {
      notice: noticeKo,
      noticeEn: translated.en,
      noticeZh: translated.zh,
      noticeJa: translated.ja,
    });
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

/** 빈 문자열·undefined·null·공백만 → null, 그 외엔 원문 그대로 */
function pickOrNull(value: string | null | undefined): string | null {
  if (value === undefined || value === null) return null;
  const trimmed = value.trim();
  return trimmed.length ? value : null;
}
