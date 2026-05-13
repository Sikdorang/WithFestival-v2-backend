import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { OPENAPI_INCREMENT_TABLE_LIKE } from '../../swagger/table-likes/dto.openapi';

function trim({ value }: { value: unknown }): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export class IncrementTableLikeDto {
  @ApiProperty(OPENAPI_INCREMENT_TABLE_LIKE.tokenUuid)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  tokenUuid!: string;
}
