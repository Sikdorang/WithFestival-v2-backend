import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { OPENAPI_CREATE_STORE } from '../../swagger/stores/dto.openapi';

export class CreateStoreDto {
  @ApiProperty({ ...OPENAPI_CREATE_STORE.name })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ ...OPENAPI_CREATE_STORE.accountNumber })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  accountNumber?: string;

  @ApiPropertyOptional({ ...OPENAPI_CREATE_STORE.notice })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notice?: string;

  @ApiPropertyOptional({ ...OPENAPI_CREATE_STORE.event })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  event?: string;

  @ApiProperty({ ...OPENAPI_CREATE_STORE.authCode })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  authCode!: string;
}
