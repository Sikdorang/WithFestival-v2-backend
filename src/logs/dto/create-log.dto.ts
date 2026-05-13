import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { OPENAPI_CREATE_LOG } from '../../swagger/logs/dto.openapi';

function trim({ value }: { value: unknown }): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export class CreateLogDto {
  @ApiProperty(OPENAPI_CREATE_LOG.identifier)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  identifier!: string;

  @ApiProperty(OPENAPI_CREATE_LOG.action)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  action!: string;

  @ApiProperty(OPENAPI_CREATE_LOG.storeId)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(2_000_000_000)
  storeId!: number;
}
