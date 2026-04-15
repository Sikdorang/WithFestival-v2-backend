import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OrdersController, OrdersStaffController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [AuthModule],
  controllers: [OrdersController, OrdersStaffController],
  providers: [OrdersService],
})
export class OrdersModule {}
