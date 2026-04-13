import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtValidatedUser } from '../jwt.strategy';

export const CurrentStoreId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtValidatedUser }>();
    return request.user.storeId;
  },
);
