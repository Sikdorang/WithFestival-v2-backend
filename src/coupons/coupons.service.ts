import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponHolderDto } from './dto/update-coupon-holder.dto';
import { UpdateCouponUsedDto } from './dto/update-coupon-used.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

export type CouponValidateResult =
  | { valid: true; discountPrice: number }
  | { valid: false };

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  listByStore(storeId: number) {
    return this.prisma.coupon.findMany({
      where: { storeId },
      orderBy: { id: 'asc' },
    });
  }

  async createForStore(storeId: number, dto: CreateCouponDto) {
    const code = dto.code.trim();
    if (!code.length) {
      throw new BadRequestException('code는 빈 문자열일 수 없습니다.');
    }

    try {
      return await this.prisma.coupon.create({
        data: {
          storeId,
          code,
          discountPrice: dto.discountPrice,
          used: false,
          holder:
            dto.holder !== undefined && dto.holder.length > 0
              ? dto.holder.trim()
              : null,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          '동일 스토어에 같은 code를 가진 쿠폰이 이미 있습니다.',
        );
      }
      throw e;
    }
  }

  async validateForStore(
    storeId: number,
    dto: ValidateCouponDto,
  ): Promise<CouponValidateResult> {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });
    if (!store) {
      throw new NotFoundException(`Store ${storeId} not found`);
    }

    const code = dto.code.trim();
    if (!code.length) {
      return { valid: false };
    }

    const row = await this.prisma.coupon.findUnique({
      where: {
        storeId_code: { storeId, code },
      },
      select: {
        discountPrice: true,
        used: true,
      },
    });

    if (!row || row.used) {
      return { valid: false };
    }

    return { valid: true, discountPrice: row.discountPrice };
  }

  async updateUsed(
    storeId: number,
    couponId: number,
    dto: UpdateCouponUsedDto,
  ) {
    await this.assertCouponOwnedByStore(storeId, couponId);
    return this.prisma.coupon.update({
      where: { id: couponId },
      data: { used: dto.used },
    });
  }

  async updateHolder(
    storeId: number,
    couponId: number,
    dto: UpdateCouponHolderDto,
  ) {
    await this.assertCouponOwnedByStore(storeId, couponId);

    if (dto.holder === undefined) {
      throw new BadRequestException(
        'holder 필드가 필요합니다(null로 비우기 가능합니다).',
      );
    }

    let holderVal: string | null = dto.holder;
    if (holderVal !== null) {
      if (typeof holderVal !== 'string') {
        throw new BadRequestException('holder는 문자열 또는 null이어야 합니다.');
      }
      if (holderVal.length > 200) {
        throw new BadRequestException('holder는 최대 200자입니다.');
      }
    }

    return this.prisma.coupon.update({
      where: { id: couponId },
      data: { holder: holderVal },
    });
  }

  async deleteForStore(storeId: number, couponId: number) {
    await this.assertCouponOwnedByStore(storeId, couponId);
    return this.prisma.coupon.delete({
      where: { id: couponId },
    });
  }

  private async assertCouponOwnedByStore(
    storeId: number,
    couponId: number,
  ): Promise<void> {
    const row = await this.prisma.coupon.findFirst({
      where: { id: couponId, storeId },
      select: { id: true },
    });
    if (!row) {
      throw new NotFoundException('Coupon not found for this store');
    }
  }
}
