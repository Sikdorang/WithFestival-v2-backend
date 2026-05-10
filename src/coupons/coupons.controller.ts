import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentStoreId } from '../auth/decorators/current-store-id.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Coupon } from '../../generated/prisma/client';
import {
  ApiCouponCreateStaffDocs,
  ApiCouponListStaffDocs,
  ApiCouponPatchHolderDocs,
  ApiCouponPatchUsedDocs,
  ApiCouponsPublicControllerDocs,
  ApiCouponsStaffControllerDocs,
  ApiCouponValidateDocs,
} from '../swagger/coupons/coupons.swagger';
import { CouponsService, type CouponValidateResult } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponHolderDto } from './dto/update-coupon-holder.dto';
import { UpdateCouponUsedDto } from './dto/update-coupon-used.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

@ApiCouponsPublicControllerDocs()
@Controller('stores')
export class CouponsPublicController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post(':storeId/coupons/validate')
  @ApiCouponValidateDocs()
  validate(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Body() dto: ValidateCouponDto,
  ): Promise<CouponValidateResult> {
    return this.couponsService.validateForStore(storeId, dto);
  }
}

@ApiCouponsStaffControllerDocs()
@UseGuards(JwtAuthGuard)
@Controller('coupons')
export class CouponsStaffController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @ApiCouponCreateStaffDocs()
  create(
    @CurrentStoreId() storeId: number,
    @Body() dto: CreateCouponDto,
  ): Promise<Coupon> {
    return this.couponsService.createForStore(storeId, dto);
  }

  @Get()
  @ApiCouponListStaffDocs()
  list(@CurrentStoreId() storeId: number): Promise<Coupon[]> {
    return this.couponsService.listByStore(storeId);
  }

  @Patch(':id/used')
  @ApiCouponPatchUsedDocs()
  updateUsed(
    @CurrentStoreId() storeId: number,
    @Param('id', ParseIntPipe) couponId: number,
    @Body() dto: UpdateCouponUsedDto,
  ): Promise<Coupon> {
    return this.couponsService.updateUsed(storeId, couponId, dto);
  }

  @Patch(':id/holder')
  @ApiCouponPatchHolderDocs()
  updateHolder(
    @CurrentStoreId() storeId: number,
    @Param('id', ParseIntPipe) couponId: number,
    @Body() dto: UpdateCouponHolderDto,
  ): Promise<Coupon> {
    return this.couponsService.updateHolder(storeId, couponId, dto);
  }
}
