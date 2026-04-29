import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentStoreId } from '../auth/decorators/current-store-id.decorator';
import {
  ApiStoreCreateDocs,
  ApiStoresControllerDocs,
  ApiStoreJwtPatch,
} from '../swagger/stores/stores.swagger';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreAccountNumberDto } from './dto/update-store-account-number.dto';
import { UpdateStoreEventDto } from './dto/update-store-event.dto';
import { UpdateStoreMissionsEnabledDto } from './dto/update-store-missions-enabled.dto';
import { UpdateStoreNameDto } from './dto/update-store-name.dto';
import { UpdateStoreNoticeDto } from './dto/update-store-notice.dto';
import { UpdateStoreReservationEnabledDto } from './dto/update-store-reservation-enabled.dto';
import { StoresService } from './stores.service';

@ApiStoresControllerDocs()
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @ApiStoreCreateDocs()
  create(@Body() dto: CreateStoreDto) {
    return this.storesService.create(dto);
  }

  @Patch('name')
  @UseGuards(JwtAuthGuard)
  @ApiStoreJwtPatch('name')
  updateName(
    @CurrentStoreId() storeId: number,
    @Body() dto: UpdateStoreNameDto,
  ) {
    return this.storesService.updateName(storeId, dto);
  }

  @Patch('account-number')
  @UseGuards(JwtAuthGuard)
  @ApiStoreJwtPatch('account-number')
  updateAccountNumber(
    @CurrentStoreId() storeId: number,
    @Body() dto: UpdateStoreAccountNumberDto,
  ) {
    return this.storesService.updateAccountNumber(storeId, dto);
  }

  @Patch('notice')
  @UseGuards(JwtAuthGuard)
  @ApiStoreJwtPatch('notice')
  updateNotice(
    @CurrentStoreId() storeId: number,
    @Body() dto: UpdateStoreNoticeDto,
  ) {
    return this.storesService.updateNotice(storeId, dto);
  }

  @Patch('event')
  @UseGuards(JwtAuthGuard)
  @ApiStoreJwtPatch('event')
  updateEvent(
    @CurrentStoreId() storeId: number,
    @Body() dto: UpdateStoreEventDto,
  ) {
    return this.storesService.updateEvent(storeId, dto);
  }

  @Patch('reservation-enabled')
  @UseGuards(JwtAuthGuard)
  @ApiStoreJwtPatch('reservation-enabled')
  updateReservationEnabled(
    @CurrentStoreId() storeId: number,
    @Body() dto: UpdateStoreReservationEnabledDto,
  ) {
    return this.storesService.updateReservationEnabled(storeId, dto);
  }

  @Patch('missions-enabled')
  @UseGuards(JwtAuthGuard)
  @ApiStoreJwtPatch('missions-enabled')
  updateMissionsEnabled(
    @CurrentStoreId() storeId: number,
    @Body() dto: UpdateStoreMissionsEnabledDto,
  ) {
    return this.storesService.updateMissionsEnabled(storeId, dto);
  }
}
