import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { OPENAPI_UPDATE_STORE_ACCOUNT } from '../../swagger/stores/dto.openapi';

export class UpdateStoreAccountNumberDto {
  @ApiPropertyOptional({ ...OPENAPI_UPDATE_STORE_ACCOUNT.accountNumber })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  accountNumber?: string;
}
