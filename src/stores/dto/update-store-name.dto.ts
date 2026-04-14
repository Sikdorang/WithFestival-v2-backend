import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { OPENAPI_UPDATE_STORE_NAME } from '../../swagger/stores/dto.openapi';

export class UpdateStoreNameDto {
  @ApiProperty({ ...OPENAPI_UPDATE_STORE_NAME.name })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;
}
