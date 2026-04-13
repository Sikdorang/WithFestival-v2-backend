import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentStoreId } from '../auth/decorators/current-store-id.decorator';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreAccountNumberDto } from './dto/update-store-account-number.dto';
import { UpdateStoreEventDto } from './dto/update-store-event.dto';
import { UpdateStoreNameDto } from './dto/update-store-name.dto';
import { UpdateStoreNoticeDto } from './dto/update-store-notice.dto';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  create(@Body() dto: CreateStoreDto) {
    return this.storesService.create(dto);
  }

  @Patch('name')
  @UseGuards(JwtAuthGuard)
  updateName(
    @CurrentStoreId() storeId: number,
    @Body() dto: UpdateStoreNameDto,
  ) {
    return this.storesService.updateName(storeId, dto);
  }

  @Patch('account-number')
  @UseGuards(JwtAuthGuard)
  updateAccountNumber(
    @CurrentStoreId() storeId: number,
    @Body() dto: UpdateStoreAccountNumberDto,
  ) {
    return this.storesService.updateAccountNumber(storeId, dto);
  }

  @Patch('notice')
  @UseGuards(JwtAuthGuard)
  updateNotice(
    @CurrentStoreId() storeId: number,
    @Body() dto: UpdateStoreNoticeDto,
  ) {
    return this.storesService.updateNotice(storeId, dto);
  }

  @Patch('event')
  @UseGuards(JwtAuthGuard)
  updateEvent(
    @CurrentStoreId() storeId: number,
    @Body() dto: UpdateStoreEventDto,
  ) {
    return this.storesService.updateEvent(storeId, dto);
  }
}
