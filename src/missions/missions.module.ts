import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MissionsController, MissionsPublicController } from './missions.controller';
import { MissionsService } from './missions.service';

@Module({
  imports: [AuthModule],
  controllers: [MissionsPublicController, MissionsController],
  providers: [MissionsService],
})
export class MissionsModule {}
