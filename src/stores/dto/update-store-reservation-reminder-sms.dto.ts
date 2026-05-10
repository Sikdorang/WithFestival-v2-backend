import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { OPENAPI_UPDATE_STORE_RESERVATION_REMINDER_SMS } from '../../swagger/stores/dto.openapi';

export class UpdateStoreReservationReminderSmsDto {
  @ApiProperty(OPENAPI_UPDATE_STORE_RESERVATION_REMINDER_SMS.remind5MinBefore)
  @Type(() => Boolean)
  @IsBoolean()
  remind5MinBefore!: boolean;

  @ApiProperty(OPENAPI_UPDATE_STORE_RESERVATION_REMINDER_SMS.remind10MinBefore)
  @Type(() => Boolean)
  @IsBoolean()
  remind10MinBefore!: boolean;
}
