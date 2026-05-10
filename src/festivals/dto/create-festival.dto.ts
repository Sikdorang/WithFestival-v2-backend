import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { OPENAPI_CREATE_FESTIVAL } from '../../swagger/festivals/dto.openapi';

function trim({ value }: { value: unknown }): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export class CreateFestivalDto {
  @ApiProperty(OPENAPI_CREATE_FESTIVAL.name)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiProperty(OPENAPI_CREATE_FESTIVAL.location)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  location!: string;

  @ApiProperty(OPENAPI_CREATE_FESTIVAL.period)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  period!: string;
}
