import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from 'class-validator';
import { OPENAPI_CREATE_TABLE_LIKE } from '../../swagger/table-likes/dto.openapi';

function trim({ value }: { value: unknown }): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export class CreateTableLikeDto {
  @ApiProperty(OPENAPI_CREATE_TABLE_LIKE.nickname)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  nickname!: string;

  @ApiProperty(OPENAPI_CREATE_TABLE_LIKE.storeId)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(2_000_000_000)
  storeId!: number;

  @ApiProperty(OPENAPI_CREATE_TABLE_LIKE.tableId)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(2_000_000_000)
  tableId!: number;
}
