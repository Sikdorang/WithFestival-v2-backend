import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateStoreNoticeDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notice?: string;
}
