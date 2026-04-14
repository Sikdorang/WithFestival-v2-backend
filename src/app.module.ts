import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MenusModule } from './menus/menus.module';
import { PrismaModule } from './prisma/prisma.module';
import { StoresModule } from './stores/stores.module';
import { WaitingsModule } from './waitings/waitings.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    StoresModule,
    MenusModule,
    WaitingsModule,
  ],
})
export class AppModule {}
