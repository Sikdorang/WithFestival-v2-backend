import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { OPENAPI_UPDATE_COUPON_HOLDER } from '../../swagger/coupons/dto.openapi';

/** `holder` 키는 필수(null로 비우기 가능). 길이·타입은 서비스에서 검사합니다. */
export class UpdateCouponHolderDto {
  @ApiProperty({
    ...OPENAPI_UPDATE_COUPON_HOLDER.holder,
    required: true,
  })
  @Transform(({ value }: { value: unknown }) => {
    if (value === undefined) return undefined;
    if (value === null) return null;
    if (typeof value === 'string') {
      const s = value.trim();
      return s.length ? s : null;
    }
    return value;
  })
  holder!: string | null | undefined;
}
