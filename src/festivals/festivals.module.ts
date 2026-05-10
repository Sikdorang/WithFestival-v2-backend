import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import {
  FestivalsPublicController,
  FestivalsStaffController,
} from './festivals.controller';
import { FestivalsService } from './festivals.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [FestivalsPublicController, FestivalsStaffController],
  providers: [FestivalsService],
})
export class FestivalsModule {}
