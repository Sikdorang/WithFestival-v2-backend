import {
  Body,
  Controller,
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
  ApiOrderCreatePublicDocs,
  ApiOrderItemCompletedDocs,
  ApiOrderItemUncompletedDocs,
  ApiOrderListAllDocs,
  ApiOrderListDocs,
  ApiOrderPaymentFailedDocs,
  ApiOrderPaymentPaidDocs,
  ApiOrdersPublicCreateControllerDocs,
  ApiOrdersStaffControllerDocs,
  ApiOrderStatusCanceledDocs,
  ApiOrderStatusCompletedDocs,
} from '../swagger/orders/orders.swagger';
import { CreatePublicOrderDto } from './dto/create-public-order.dto';
import { OrdersService } from './orders.service';

@ApiOrdersPublicCreateControllerDocs()
@Controller()
export class OrdersPublicCreateController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('orders')
  @ApiOrderCreatePublicDocs()
  create(@Body() dto: CreatePublicOrderDto) {
    return this.ordersService.createFromPublicDto(dto);
  }
}

@ApiOrdersStaffControllerDocs()
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

  @Get('all')
  @ApiOrderListAllDocs()
  listAll(@CurrentStoreId() storeId: number) {
    return this.ordersService.listAllByStore(storeId);
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

  @Patch(':orderId/items/:itemId/completed')
  @ApiOrderItemCompletedDocs()
  setItemCompleted(
    @CurrentStoreId() storeId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.ordersService.setItemCompleted(storeId, orderId, itemId, true);
  }

  @Patch(':orderId/items/:itemId/uncompleted')
  @ApiOrderItemUncompletedDocs()
  setItemUncompleted(
    @CurrentStoreId() storeId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.ordersService.setItemCompleted(storeId, orderId, itemId, false);
  }
}
