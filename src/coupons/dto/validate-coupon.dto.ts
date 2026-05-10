import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { OPENAPI_VALIDATE_COUPON } from '../../swagger/coupons/dto.openapi';

export class ValidateCouponDto {
  @ApiProperty(OPENAPI_VALIDATE_COUPON.code)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(64)
  code!: string;
}
