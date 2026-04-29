import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { OPENAPI_UPDATE_MISSION } from '../../swagger/missions/dto.openapi';

export class UpdateMissionDto {
  @ApiPropertyOptional({ ...OPENAPI_UPDATE_MISSION.missionName })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  missionName?: string;

  @ApiPropertyOptional({ ...OPENAPI_UPDATE_MISSION.description })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ ...OPENAPI_UPDATE_MISSION.reward })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reward?: string;
}
