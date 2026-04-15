import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentStoreId } from '../auth/decorators/current-store-id.decorator';
import {
  ApiOrderCreateDocs,
  ApiOrderListDocs,
  ApiOrderPaymentFailedDocs,
  ApiOrderPaymentPaidDocs,
  ApiOrdersControllerDocs,
  ApiOrderStatusCanceledDocs,
  ApiOrderStatusCompletedDocs,
} from '../swagger/orders/orders.swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@ApiOrdersControllerDocs()
@UseGuards(JwtAuthGuard)
@Controller('stores/:storeId/tables/:tableId')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('orders')
  @ApiOrderCreateDocs()
  create(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('tableId', ParseIntPipe) tableId: number,
    @CurrentStoreId() jwtStoreId: number,
    @Body() dto: CreateOrderDto,
  ) {
    if (storeId !== jwtStoreId) {
      throw new ForbiddenException(
        'URL storeId must match the authenticated store (JWT sub)',
      );
    }
    return this.ordersService.createForStore(storeId, tableId, dto);
  }
}

@ApiOrdersControllerDocs()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersStaffController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOrderListDocs()
  list(
    @CurrentStoreId() storeId: number,
    @Query('paid', ParseBoolPipe) paid: boolean,
  ) {
    return this.ordersService.listByStore(storeId, paid);
  }

  @Patch(':id/payment/paid')
  @ApiOrderPaymentPaidDocs()
  setPaymentPaid(
    @CurrentStoreId() storeId: number,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.ordersService.setPaymentPaid(storeId, orderId);
  }

  @Patch(':id/payment/failed')
  @ApiOrderPaymentFailedDocs()
  setPaymentFailed(
    @CurrentStoreId() storeId: number,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.ordersService.setPaymentFailed(storeId, orderId);
  }

  @Patch(':id/status/cancelled')
  @ApiOrderStatusCanceledDocs()
  setStatusCanceled(
    @CurrentStoreId() storeId: number,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.ordersService.setStatusCanceled(storeId, orderId);
  }

  @Patch(':id/status/completed')
  @ApiOrderStatusCompletedDocs()
  setStatusCompleted(
    @CurrentStoreId() storeId: number,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.ordersService.setStatusCompleted(storeId, orderId);
  }
}
