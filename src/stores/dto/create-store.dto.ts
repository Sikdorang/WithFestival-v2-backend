import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  accountNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notice?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  event?: string;

  /** 부스 인증용 코드 (기존 number 역할) */
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  authCode!: string;
}
