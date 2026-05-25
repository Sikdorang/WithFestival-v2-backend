import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBlindDateCreateDocs,
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
}
