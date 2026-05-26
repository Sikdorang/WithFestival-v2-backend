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
  ApiOrderItemToggleCompletedDocs,
  ApiOrderListAllDocs,
  ApiOrderListCanceledDocs,
  ApiOrderListDocs,
  ApiOrderPaymentFailedDocs,
  ApiOrderPaymentPaidDocs,
  ApiOrdersPublicCreateControllerDocs,
  ApiOrdersStaffControllerDocs,
  ApiOrderStatusCanceledDocs,
  ApiOrderStatusCompletedDocs,
  ApiOrderToggleDeletedDocs,
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

  @Get('canceled')
  @ApiOrderListCanceledDocs()
  listCanceled(@CurrentStoreId() storeId: number) {
    return this.ordersService.listCanceledByStore(storeId);
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

  @Patch('items/:itemId/toggle-completed')
  @ApiOrderItemToggleCompletedDocs()
  toggleItemCompleted(
    @CurrentStoreId() storeId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.ordersService.toggleItemCompleted(storeId, itemId);
  }

  @Patch(':id/toggle-deleted')
  @ApiOrderToggleDeletedDocs()
  toggleDeleted(
    @CurrentStoreId() storeId: number,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.ordersService.toggleDeleted(storeId, orderId);
  }
}
