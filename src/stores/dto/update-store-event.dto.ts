import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { OPENAPI_UPDATE_STORE_EVENT } from '../../swagger/stores/dto.openapi';

export class UpdateStoreEventDto {
  @ApiPropertyOptional({ ...OPENAPI_UPDATE_STORE_EVENT.event })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  event?: string;
}
