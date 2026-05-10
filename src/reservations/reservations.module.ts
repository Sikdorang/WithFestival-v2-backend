import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import {
  ReservationsBookingsStaffController,
  ReservationsPublicController,
  ReservationsStaffController,
  ReservationsStaffReservationPathController,
} from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [AuthModule],
  controllers: [
    ReservationsPublicController,
    ReservationsStaffReservationPathController,
    ReservationsStaffController,
    ReservationsBookingsStaffController,
  ],
  providers: [ReservationsService],
})
export class ReservationsModule {}
