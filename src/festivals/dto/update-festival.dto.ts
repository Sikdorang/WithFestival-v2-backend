import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { OPENAPI_UPDATE_FESTIVAL } from '../../swagger/festivals/dto.openapi';

function trim({ value }: { value: unknown }): unknown {
  if (value === undefined) return undefined;
  return typeof value === 'string' ? value.trim() : value;
}

export class UpdateFestivalDto {
  @ApiPropertyOptional(OPENAPI_UPDATE_FESTIVAL.name)
  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional(OPENAPI_UPDATE_FESTIVAL.location)
  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  location?: string;

  @ApiPropertyOptional(OPENAPI_UPDATE_FESTIVAL.period)
  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(200)
  period?: string;
}
