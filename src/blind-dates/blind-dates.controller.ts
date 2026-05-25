import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBlindDateCreateDocs,
  ApiBlindDateListDocs,
  ApiBlindDatesControllerDocs,
} from '../swagger/blind-dates/blind-dates.swagger';
import { BlindDatesService } from './blind-dates.service';
import { CreateBlindDateDto } from './dto/create-blind-date.dto';

@ApiBlindDatesControllerDocs()
@Controller('blind-dates')
export class BlindDatesController {
  constructor(private readonly blindDatesService: BlindDatesService) {}

  @Post()
  @ApiBlindDateCreateDocs()
  create(@Body() dto: CreateBlindDateDto) {
    return this.blindDatesService.createFromPublicDto(dto);
  }

  @Get()
  @ApiBlindDateListDocs()
  list() {
    return this.blindDatesService.listAll();
  }
}
