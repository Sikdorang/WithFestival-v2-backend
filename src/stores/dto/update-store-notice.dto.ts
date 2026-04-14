import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { OPENAPI_UPDATE_STORE_NOTICE } from '../../swagger/stores/dto.openapi';

export class UpdateStoreNoticeDto {
  @ApiPropertyOptional({ ...OPENAPI_UPDATE_STORE_NOTICE.notice })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notice?: string;
}
