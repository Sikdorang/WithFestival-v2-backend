import { Body, Controller, Post } from '@nestjs/common';
import { ApiAuthControllerDocs, ApiLoginDocs } from '../swagger/auth/auth.swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiAuthControllerDocs()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiLoginDocs()
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
