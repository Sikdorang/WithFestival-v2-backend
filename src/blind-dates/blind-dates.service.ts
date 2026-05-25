import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlindDateDto } from './dto/create-blind-date.dto';
import { ListBlindDatesDto } from './dto/list-blind-dates.dto';

/**
 * 운영자 인증 비밀번호는 **반드시 환경변수**(`BLIND_DATE_ADMIN_PASSWORD`)로만 주입합니다.
 * 보안상 소스 코드와 공개 문서(Swagger)에는 어떤 fallback/example 도 두지 않습니다.
 */
const ADMIN_PASSWORD_ENV_KEY = 'BLIND_DATE_ADMIN_PASSWORD' as const;

@Injectable()
export class BlindDatesService {
  private readonly logger = new Logger(BlindDatesService.name);

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
   * 본문 비밀번호가 환경변수 `BLIND_DATE_ADMIN_PASSWORD` 와 일치할 때만
   * 전체 명단을 createdAt 내림차순으로 반환.
   *
   * - 환경변수가 비어 있으면 **503** 으로 응답(소스/공개문서 어디에도 fallback 없음)
   * - 타이밍 공격 방어를 위해 상수시간 비교
   */
  async listAll(dto: ListBlindDatesDto) {
    const expected = this.getAdminPasswordOrThrow();
    if (!safeEqual(dto.password, expected)) {
      throw new UnauthorizedException('Invalid password');
    }

    return this.prisma.blindDate.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  private getAdminPasswordOrThrow(): string {
    const raw = process.env[ADMIN_PASSWORD_ENV_KEY]?.trim();
    if (!raw || !raw.length) {
      this.logger.error(
        `${ADMIN_PASSWORD_ENV_KEY} env is not configured; refusing to authenticate.`,
      );
      throw new ServiceUnavailableException(
        'Admin authentication is not configured on the server',
      );
    }
    return raw;
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
