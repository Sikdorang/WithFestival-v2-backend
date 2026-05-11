import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { OPENAPI_CREATE_FESTIVAL } from '../../swagger/festivals/dto.openapi';

function trim({ value }: { value: unknown }): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export class CreateFestivalDto {
  @ApiProperty(OPENAPI_CREATE_FESTIVAL.university)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  university!: string;

  @ApiProperty(OPENAPI_CREATE_FESTIVAL.name)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiProperty(OPENAPI_CREATE_FESTIVAL.startDate)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  startDate!: string;

  @ApiProperty(OPENAPI_CREATE_FESTIVAL.endDate)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  endDate!: string;

  @ApiProperty(OPENAPI_CREATE_FESTIVAL.location)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  location!: string;
}
