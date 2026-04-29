import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { OPENAPI_CREATE_RESERVATION } from '../../swagger/reservations/dto.openapi';

export class CreateReservationDto {
  @ApiProperty({ ...OPENAPI_CREATE_RESERVATION.reservationSlotId })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  reservationSlotId!: number;

  @ApiProperty({ ...OPENAPI_CREATE_RESERVATION.reserverName })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  reserverName!: string;

  @ApiProperty({ ...OPENAPI_CREATE_RESERVATION.phoneNumber })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  phoneNumber!: string;

  @ApiProperty({ ...OPENAPI_CREATE_RESERVATION.partySize })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  partySize!: number;
}
