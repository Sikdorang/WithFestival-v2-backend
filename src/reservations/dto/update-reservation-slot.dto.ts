import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class UpdateReservationSlotDto {
  @ApiPropertyOptional({
    example: '10:30',
    description: '예약 시작 시간 문자열',
    maxLength: 32,
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  startTime?: string;

  @ApiPropertyOptional({
    example: '12:00',
    description: '예약 종료 시간 문자열',
    maxLength: 32,
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  endTime?: string;

  @ApiPropertyOptional({
    example: 10,
    description: '해당 시간대 예약 가능 테이블 수',
    minimum: 0,
    maximum: 500,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(500)
  availableTables?: number;
}
