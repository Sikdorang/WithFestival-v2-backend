import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

export type StoreAccessTokenPayload = {
  /** Store PK */
  sub: number;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const store = await this.prisma.store.findUnique({
      where: { authCode: dto.authCode },
    });

    if (!store) {
      throw new UnauthorizedException('Invalid auth code');
    }

    const payload: StoreAccessTokenPayload = { sub: store.id };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
