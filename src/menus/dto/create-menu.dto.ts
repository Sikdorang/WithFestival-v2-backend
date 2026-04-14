import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { OPENAPI_CREATE_MENU } from '../../swagger/menus/dto.openapi';

export class CreateMenuDto {
  @ApiProperty({ ...OPENAPI_CREATE_MENU.name })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({ ...OPENAPI_CREATE_MENU.price })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(2_000_000_000)
  price: number;

  @ApiPropertyOptional({ ...OPENAPI_CREATE_MENU.description })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
