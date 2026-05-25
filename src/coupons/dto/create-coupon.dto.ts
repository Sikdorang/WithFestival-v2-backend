import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CouponType } from '../../../generated/prisma/client';
import { OPENAPI_CREATE_COUPON } from '../../swagger/coupons/dto.openapi';

function trimHolder({ value }: { value: unknown }): unknown {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') return value;
  const s = value.trim();
  return s.length ? s : undefined;
}

export class CreateCouponDto {
  @ApiProperty({ ...OPENAPI_CREATE_COUPON.code })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(64)
  code!: string;

  @ApiProperty({ ...OPENAPI_CREATE_COUPON.discountPrice })
  @IsInt()
  @Min(0)
  @Max(2_000_000_000)
  discountPrice!: number;

  @ApiPropertyOptional({ ...OPENAPI_CREATE_COUPON.type })
  @IsOptional()
  @IsEnum(CouponType)
  type?: CouponType;

  @ApiPropertyOptional({ ...OPENAPI_CREATE_COUPON.holder })
  @Transform(trimHolder)
  @IsOptional()
  @IsString()
  @MaxLength(200)
  holder?: string;
}
