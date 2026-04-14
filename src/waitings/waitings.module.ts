import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import {
  WaitingsPublicController,
  WaitingsStaffController,
} from './waitings.controller';
import { WaitingsService } from './waitings.service';

@Module({
  imports: [AuthModule],
  controllers: [WaitingsPublicController, WaitingsStaffController],
  providers: [WaitingsService],
})
export class WaitingsModule {}
