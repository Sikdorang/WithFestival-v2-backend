import { Module } from '@nestjs/common';
import { BlindDatesController } from './blind-dates.controller';
import { BlindDatesService } from './blind-dates.service';

@Module({
  controllers: [BlindDatesController],
  providers: [BlindDatesService],
})
export class BlindDatesModule {}
