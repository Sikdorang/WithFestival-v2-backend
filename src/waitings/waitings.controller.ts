import { Body, Controller, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentStoreId } from '../auth/decorators/current-store-id.decorator';
import {
  ApiWaitingsCreateDocs,
  ApiWaitingsPublicControllerDocs,
  ApiWaitingsStaffControllerDocs,
  ApiWaitingStatusPatchDocs,
} from '../swagger/waitings/waitings.swagger';
import { CreateWaitingDto } from './dto/create-waiting.dto';
import { UpdateWaitingStatusDto } from './dto/update-waiting-status.dto';
import { WaitingsService } from './waitings.service';

@ApiWaitingsPublicControllerDocs()
@Controller('stores')
export class WaitingsPublicController {
  constructor(private readonly waitingsService: WaitingsService) {}

  /** 대기 등록 — 고객용. `POST /stores/{storeId}/waitings` 리소스 트리. */
  @Post(':storeId/waitings')
  @ApiWaitingsCreateDocs()
  create(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Body() dto: CreateWaitingDto,
  ) {
    return this.waitingsService.create(storeId, dto);
  }
}

@ApiWaitingsStaffControllerDocs()
@UseGuards(JwtAuthGuard)
@Controller('waitings')
export class WaitingsStaffController {
  constructor(private readonly waitingsService: WaitingsService) {}

  @Patch(':id')
  @ApiWaitingStatusPatchDocs()
  updateStatus(
    @CurrentStoreId() storeId: number,
    @Param('id', ParseIntPipe) waitingId: number,
    @Body() dto: UpdateWaitingStatusDto,
  ) {
    return this.waitingsService.updateStatus(storeId, waitingId, dto);
  }
}
