import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { OPENAPI_UPDATE_STORE_MISSIONS_ENABLED } from '../../swagger/stores/dto.openapi';

export class UpdateStoreMissionsEnabledDto {
  @ApiProperty({ ...OPENAPI_UPDATE_STORE_MISSIONS_ENABLED.missionsEnabled })
  @Type(() => Boolean)
  @IsBoolean()
  missionsEnabled!: boolean;
}
