import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OPENAPI_CREATE_RESERVATION_SLOT } from '../../swagger/reservations/dto.openapi';

export class CreateReservationSlotDto {
  @ApiProperty({ ...OPENAPI_CREATE_RESERVATION_SLOT.startTime })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  startTime!: string;

  @ApiProperty({ ...OPENAPI_CREATE_RESERVATION_SLOT.endTime })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  endTime!: string;

  @ApiProperty({ ...OPENAPI_CREATE_RESERVATION_SLOT.availableTables })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(500)
  availableTables!: number;
}
