import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { OPENAPI_UPDATE_MISSION_ACTIVE } from '../../swagger/missions/dto.openapi';

export class UpdateMissionActiveDto {
  @ApiProperty({ ...OPENAPI_UPDATE_MISSION_ACTIVE.isActive })
  @Type(() => Boolean)
  @IsBoolean()
  isActive!: boolean;
}
