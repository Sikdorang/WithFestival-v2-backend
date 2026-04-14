import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { OPENAPI_LOGIN } from '../../swagger/auth/dto.openapi';

export class LoginDto {
  @ApiProperty({ ...OPENAPI_LOGIN.authCode })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  authCode!: string;
}
