import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import {
  OrdersPublicCreateController,
  OrdersStaffController,
} from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [OrdersPublicCreateController, OrdersStaffController],
  providers: [OrdersService],
})
export class OrdersModule {}
