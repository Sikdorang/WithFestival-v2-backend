import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CouponsPublicController, CouponsStaffController } from './coupons.controller';
import { CouponsService } from './coupons.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CouponsPublicController, CouponsStaffController],
  providers: [CouponsService],
})
export class CouponsModule {}
