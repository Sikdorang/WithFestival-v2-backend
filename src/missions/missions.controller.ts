import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { Mission } from '../../generated/prisma/client';
import { CurrentStoreId } from '../auth/decorators/current-store-id.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiMissionCreateDocs,
  ApiMissionDeleteDocs,
  ApiMissionGetOneDocs,
  ApiMissionToggleActiveDocs,
  ApiMissionUpdateDocs,
  ApiMissionsControllerDocs,
  ApiMissionsListDocs,
  ApiMissionsPublicControllerDocs,
  ApiMissionsPublicListDocs,
} from '../swagger/missions/missions.swagger';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionActiveDto } from './dto/update-mission-active.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { MissionsService } from './missions.service';

@ApiMissionsPublicControllerDocs()
@Controller('stores')
export class MissionsPublicController {
  constructor(private readonly missionsService: MissionsService) {}

  @Get(':storeId/missions')
  @ApiMissionsPublicListDocs()
  listPublic(
    @Param('storeId', ParseIntPipe) storeId: number,
  ): Promise<Mission[]> {
    return this.missionsService.listPublicActiveForStore(storeId);
  }
}

@ApiMissionsControllerDocs()
@UseGuards(JwtAuthGuard)
@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Post()
  @ApiMissionCreateDocs()
  create(@CurrentStoreId() storeId: number, @Body() dto: CreateMissionDto) {
    return this.missionsService.create(storeId, dto);
  }

  @Get()
  @ApiMissionsListDocs()
  list(@CurrentStoreId() storeId: number) {
    return this.missionsService.listForStore(storeId);
  }

  @Get(':id')
  @ApiMissionGetOneDocs()
  getOne(
    @CurrentStoreId() storeId: number,
    @Param('id', ParseIntPipe) missionId: number,
  ) {
    return this.missionsService.getOneForStore(storeId, missionId);
  }

  @Patch(':id')
  @ApiMissionUpdateDocs()
  update(
    @CurrentStoreId() storeId: number,
    @Param('id', ParseIntPipe) missionId: number,
    @Body() dto: UpdateMissionDto,
  ) {
    return this.missionsService.updateForStore(storeId, missionId, dto);
  }

  @Patch(':id/active')
  @ApiMissionToggleActiveDocs()
  toggleActive(
    @CurrentStoreId() storeId: number,
    @Param('id', ParseIntPipe) missionId: number,
    @Body() dto: UpdateMissionActiveDto,
  ) {
    return this.missionsService.toggleActiveForStore(storeId, missionId, dto);
  }

  @Delete(':id')
  @ApiMissionDeleteDocs()
  remove(
    @CurrentStoreId() storeId: number,
    @Param('id', ParseIntPipe) missionId: number,
  ) {
    return this.missionsService.deleteForStore(storeId, missionId);
  }
}
