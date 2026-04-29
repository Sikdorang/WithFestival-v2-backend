import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { OPENAPI_UPDATE_STORE_RESERVATION_ENABLED } from '../../swagger/stores/dto.openapi';

export class UpdateStoreReservationEnabledDto {
  @ApiProperty({ ...OPENAPI_UPDATE_STORE_RESERVATION_ENABLED.reservationEnabled })
  @Type(() => Boolean)
  @IsBoolean()
  reservationEnabled!: boolean;
}
