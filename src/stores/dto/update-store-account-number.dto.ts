import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateStoreAccountNumberDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  accountNumber?: string;
}
