import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SwaggerSocketModule } from './swagger/socket/swagger-socket.module';
import { CouponsModule } from './coupons/coupons.module';
import { FestivalsModule } from './festivals/festivals.module';
import { MenusModule } from './menus/menus.module';
import { MissionsModule } from './missions/missions.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReservationsModule } from './reservations/reservations.module';
import { SmsModule } from './sms/sms.module';
import { StoresModule } from './stores/stores.module';
import { TableLikesModule } from './table-likes/table-likes.module';
import { WaitingsModule } from './waitings/waitings.module';

@Module({
  imports: [
    PrismaModule,
    SwaggerSocketModule,
    AuthModule,
    CouponsModule,
    FestivalsModule,
    StoresModule,
    MenusModule,
    MissionsModule,
    OrdersModule,
    ReservationsModule,
    TableLikesModule,
    WaitingsModule,
    SmsModule,
  ],
})
export class AppModule {}
