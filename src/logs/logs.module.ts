import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LogsPublicController } from './logs.controller';
import { LogsService } from './logs.service';

@Module({
  imports: [PrismaModule],
  controllers: [LogsPublicController],
  providers: [LogsService],
})
export class LogsModule {}
