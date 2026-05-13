import { Body, Controller, Post } from '@nestjs/common';
import type { Log } from '../../generated/prisma/client';
import {
  ApiLogCreateDocs,
  ApiLogsPublicControllerDocs,
} from '../swagger/logs/logs.swagger';
import { CreateLogDto } from './dto/create-log.dto';
import { LogsService } from './logs.service';

@ApiLogsPublicControllerDocs()
@Controller('logs')
export class LogsPublicController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  @ApiLogCreateDocs()
  create(@Body() dto: CreateLogDto): Promise<Log> {
    return this.logsService.create(dto);
  }
}
