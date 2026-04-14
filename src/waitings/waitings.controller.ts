import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateWaitingDto } from './dto/create-waiting.dto';
import { WaitingsService } from './waitings.service';

@Controller('stores')
export class WaitingsController {
  constructor(private readonly waitingsService: WaitingsService) {}

  /** 예약(대기) 등록 — 고객용. 부스는 URL의 `authCode`로 식별합니다. */
  @Post(':authCode/waitings')
  create(
    @Param('authCode') authCode: string,
    @Body() dto: CreateWaitingDto,
  ) {
    return this.waitingsService.create(authCode, dto);
  }
}
