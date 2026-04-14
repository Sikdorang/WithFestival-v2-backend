import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { OPENAPI_UPDATE_MENU } from '../../swagger/menus/dto.openapi';

function emptyToUndefined({ value }: { value: unknown }) {
  if (value === '' || value === null) return undefined;
  return value;
}

function optionalPrice({ value }: { value: unknown }) {
  if (value === '' || value === null || value === undefined) return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

export class UpdateMenuDto {
  @ApiPropertyOptional({ ...OPENAPI_UPDATE_MENU.name })
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({ ...OPENAPI_UPDATE_MENU.price })
  @IsOptional()
  @Transform(optionalPrice)
  @IsInt()
  @Min(0)
  @Max(2_000_000_000)
  price?: number;

  @ApiPropertyOptional({ ...OPENAPI_UPDATE_MENU.description })
  @IsOptional()
  @Transform(({ value }) =>
    value === null || value === undefined ? undefined : String(value),
  )
  @IsString()
  @MaxLength(2000)
  description?: string;
}
