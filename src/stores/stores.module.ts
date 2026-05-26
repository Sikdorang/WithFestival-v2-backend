import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TranslationModule } from '../translation/translation.module';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';

@Module({
  imports: [AuthModule, TranslationModule],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
