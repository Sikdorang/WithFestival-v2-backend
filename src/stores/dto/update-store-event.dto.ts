import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateStoreEventDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  event?: string;
}
