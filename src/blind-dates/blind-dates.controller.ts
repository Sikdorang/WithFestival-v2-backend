import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBlindDateCreateDocs,
  ApiBlindDateListDocs,
  ApiBlindDatesControllerDocs,
} from '../swagger/blind-dates/blind-dates.swagger';
import { BlindDatesService } from './blind-dates.service';
import { CreateBlindDateDto } from './dto/create-blind-date.dto';
import { ListBlindDatesDto } from './dto/list-blind-dates.dto';

@ApiBlindDatesControllerDocs()
@Controller('blind-dates')
export class BlindDatesController {
  constructor(private readonly blindDatesService: BlindDatesService) {}

  @Post()
  @ApiBlindDateCreateDocs()
  create(@Body() dto: CreateBlindDateDto) {
    return this.blindDatesService.createFromPublicDto(dto);
  }

  /**
   * GET 본문 인증 — 비표준 패턴이지만 운영 편의를 위해 의도적으로 채택.
   * Express 기본 bodyParser 가 GET 본문도 파싱하므로 Postman/curl 에서 동작합니다.
   */
  @Get()
  @ApiBlindDateListDocs()
  list(@Body() dto: ListBlindDatesDto) {
    return this.blindDatesService.listAll(dto);
  }
}
