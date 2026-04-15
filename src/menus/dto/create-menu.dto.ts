import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { OPENAPI_CREATE_MENU } from '../../swagger/menus/dto.openapi';

function emptyToUndefined({ value }: { value: unknown }) {
  if (value === '' || value === null) return undefined;
  return value;
}

function priceDefaultZero({ value }: { value: unknown }) {
  if (value === '' || value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

export class CreateMenuDto {
  @ApiProperty({ ...OPENAPI_CREATE_MENU.name })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({
    ...OPENAPI_CREATE_MENU.price,
    description: '생략·빈 값이면 0',
    default: 0,
  })
  @Transform(priceDefaultZero)
  @IsInt()
  @Min(0)
  @Max(2_000_000_000)
  price: number;

  @ApiPropertyOptional({ ...OPENAPI_CREATE_MENU.description })
  @IsOptional()
  @Transform(emptyToUndefined)
  @IsString()
  @MaxLength(2000)
  description?: string;
}
