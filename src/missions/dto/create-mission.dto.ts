import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { OPENAPI_CREATE_MISSION } from '../../swagger/missions/dto.openapi';

export class CreateMissionDto {
  @ApiProperty({ ...OPENAPI_CREATE_MISSION.missionName })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  missionName!: string;

  @ApiPropertyOptional({ ...OPENAPI_CREATE_MISSION.description })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ ...OPENAPI_CREATE_MISSION.reward })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reward!: string;
}
