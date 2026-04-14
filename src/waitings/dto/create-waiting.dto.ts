import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateWaitingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  phoneNumber!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  partySize!: number;
}
