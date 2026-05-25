import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlindDateDto } from './dto/create-blind-date.dto';
import { ListBlindDatesDto } from './dto/list-blind-dates.dto';

/**
 * 운영자 인증 비밀번호 fallback.
 * 운영 환경에서는 환경변수 `BLIND_DATE_ADMIN_PASSWORD`를 설정해 회전 가능.
 */
const DEFAULT_ADMIN_PASSWORD = 'ftvww0921@';

@Injectable()
export class BlindDatesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 공개 응모 본문을 그대로 저장.
   * `numberDelivered`는 본 API에서 받지 않고 항상 모델 기본값(false)으로 생성됩니다.
   * `mbti`는 대문자로 정규화하여 저장합니다(매칭/필터링 일관성).
   */
  createFromPublicDto(dto: CreateBlindDateDto) {
    return this.prisma.blindDate.create({
      data: {
        name: dto.name.trim(),
        age: dto.age,
        contact: dto.contact.trim(),
        mbti: dto.mbti.trim().toUpperCase(),
        appearanceStyle: dto.appearanceStyle,
        gender: dto.gender,
        deliveryPhone: dto.deliveryPhone.trim(),
      },
    });
  }

  /**
   * 본문 비밀번호가 일치할 때만 전체 명단을 createdAt 내림차순으로 반환.
   * 비밀번호는 환경변수 `BLIND_DATE_ADMIN_PASSWORD`(미설정 시 기본값) 와 정확히 일치해야 함.
   * 타이밍 공격 방어를 위해 상수시간 비교를 사용.
   */
  async listAll(dto: ListBlindDatesDto) {
    if (!safeEqual(dto.password, this.getAdminPassword())) {
      throw new UnauthorizedException('Invalid password');
    }

    return this.prisma.blindDate.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  private getAdminPassword(): string {
    const raw = process.env.BLIND_DATE_ADMIN_PASSWORD?.trim();
    return raw && raw.length ? raw : DEFAULT_ADMIN_PASSWORD;
  }
}

/** 길이 차이를 즉시 노출하지 않도록 동일 길이 버퍼끼리 XOR 누적 비교 */
function safeEqual(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const aBuf = Buffer.from(a, 'utf8');
  const bBuf = Buffer.from(b, 'utf8');
  if (aBuf.length !== bBuf.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < aBuf.length; i++) {
    diff |= aBuf[i] ^ bBuf[i];
  }
  return diff === 0;
}
