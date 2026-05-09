import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { OPENAPI_UPDATE_STORE_WAITINGS_ENABLED } from '../../swagger/stores/dto.openapi';

export class UpdateStoreWaitingsEnabledDto {
  @ApiProperty({ ...OPENAPI_UPDATE_STORE_WAITINGS_ENABLED.waitingsEnabled })
  @Type(() => Boolean)
  @IsBoolean()
  waitingsEnabled!: boolean;
}
