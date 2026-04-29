import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import {
  ReservationsBookingsStaffController,
  ReservationsPublicController,
  ReservationsStaffController,
} from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [AuthModule],
  controllers: [
    ReservationsPublicController,
    ReservationsStaffController,
    ReservationsBookingsStaffController,
  ],
  providers: [ReservationsService],
})
export class ReservationsModule {}
