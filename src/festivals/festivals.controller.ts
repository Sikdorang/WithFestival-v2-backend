import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Festival } from '../../generated/prisma/client';
import {
  ApiFestivalCreateDocs,
  ApiFestivalDeleteDocs,
  ApiFestivalGetDocs,
  ApiFestivalListDocs,
  ApiFestivalUpdateDocs,
  ApiFestivalsPublicControllerDocs,
  ApiFestivalsStaffControllerDocs,
} from '../swagger/festivals/festivals.swagger';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { FestivalsService } from './festivals.service';

@ApiFestivalsPublicControllerDocs()
@Controller('festivals')
export class FestivalsPublicController {
  constructor(private readonly festivalsService: FestivalsService) {}

  @Get()
  @ApiFestivalListDocs()
  findAll(): Promise<Festival[]> {
    return this.festivalsService.findAll();
  }

  @Get(':id')
  @ApiFestivalGetDocs()
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Festival> {
    return this.festivalsService.findOne(id);
  }
}

@ApiFestivalsStaffControllerDocs()
@UseGuards(JwtAuthGuard)
@Controller('festivals')
export class FestivalsStaffController {
  constructor(private readonly festivalsService: FestivalsService) {}

  @Post()
  @ApiFestivalCreateDocs()
  create(@Body() dto: CreateFestivalDto): Promise<Festival> {
    return this.festivalsService.create(dto);
  }

  @Patch(':id')
  @ApiFestivalUpdateDocs()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFestivalDto,
  ): Promise<Festival> {
    return this.festivalsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiFestivalDeleteDocs()
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.festivalsService.remove(id);
  }
}
