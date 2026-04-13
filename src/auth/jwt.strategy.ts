import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StoreAccessTokenPayload } from './auth.service';
import { JWT_SECRET } from './jwt.constants';

export type JwtValidatedUser = {
  storeId: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  validate(payload: StoreAccessTokenPayload): JwtValidatedUser {
    const raw = payload.sub;
    const storeId = typeof raw === 'string' ? Number.parseInt(raw, 10) : raw;
    if (storeId == null || Number.isNaN(storeId)) {
      throw new UnauthorizedException();
    }
    return { storeId };
  }
}
