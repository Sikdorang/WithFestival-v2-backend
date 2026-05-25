import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlindDateDto } from './dto/create-blind-date.dto';

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
}
