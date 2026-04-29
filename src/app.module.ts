import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MenusModule } from './menus/menus.module';
import { MissionsModule } from './missions/missions.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReservationsModule } from './reservations/reservations.module';
import { StoresModule } from './stores/stores.module';
import { WaitingsModule } from './waitings/waitings.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    StoresModule,
    MenusModule,
    MissionsModule,
    OrdersModule,
    ReservationsModule,
    WaitingsModule,
  ],
})
export class AppModule {}
