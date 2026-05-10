import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { OPENAPI_UPDATE_COUPON_USED } from '../../swagger/coupons/dto.openapi';

export class UpdateCouponUsedDto {
  @ApiProperty(OPENAPI_UPDATE_COUPON_USED.used)
  @Type(() => Boolean)
  @IsBoolean()
  used!: boolean;
}
