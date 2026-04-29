import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentStoreId } from '../auth/decorators/current-store-id.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiReservationSlotsCreateDocs,
  ApiReservationSlotsDeleteDocs,
  ApiReservationSlotsListDocs,
  ApiReservationSlotsUpdateDocs,
  ApiReservationSlotReservationsListDocs,
  ApiReservationsCreateDocs,
  ApiReservationsDeleteDocs,
  ApiReservationsGetOneDocs,
  ApiReservationSlotsPublicControllerDocs,
  ApiReservationsPublicCreateDocs,
  ApiReservationSlotsPublicListDocs,
  ApiReservationSlotsStaffControllerDocs,
} from '../swagger/reservations/reservations.swagger';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CreateReservationSlotDto } from './dto/create-reservation-slot.dto';
import { UpdateReservationSlotDto } from './dto/update-reservation-slot.dto';
import { ReservationsService } from './reservations.service';

@ApiReservationSlotsPublicControllerDocs()
@Controller('stores')
export class ReservationsPublicController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get(':storeId/reservation-slots')
  @ApiReservationSlotsPublicListDocs()
  listByStore(@Param('storeId', ParseIntPipe) storeId: number) {
    return this.reservationsService.listForPublicStore(storeId);
  }

  @Post(':storeId/reservations')
  @ApiReservationsPublicCreateDocs()
  createReservation(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Body() dto: CreateReservationDto,
  ) {
    return this.reservationsService.createReservation(storeId, dto);
  }
}

@ApiReservationSlotsStaffControllerDocs()
@UseGuards(JwtAuthGuard)
@Controller('reservation-slots')
export class ReservationsStaffController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @ApiReservationSlotsCreateDocs()
  create(
    @CurrentStoreId() storeId: number,
    @Body() dto: CreateReservationSlotDto,
  ) {
    return this.reservationsService.createForStore(storeId, dto);
  }

  @Get()
  @ApiReservationSlotsListDocs()
  list(@CurrentStoreId() storeId: number) {
    return this.reservationsService.listForStore(storeId);
  }

  @Patch(':reservationSlotId')
  @ApiReservationSlotsUpdateDocs()
  update(
    @CurrentStoreId() storeId: number,
    @Param('reservationSlotId', ParseIntPipe) reservationSlotId: number,
    @Body() dto: UpdateReservationSlotDto,
  ) {
    return this.reservationsService.updateSlotForStore(
      storeId,
      reservationSlotId,
      dto,
    );
  }

  @Delete(':reservationSlotId')
  @ApiReservationSlotsDeleteDocs()
  remove(
    @CurrentStoreId() storeId: number,
    @Param('reservationSlotId', ParseIntPipe) reservationSlotId: number,
  ) {
    return this.reservationsService.deleteSlotForStore(
      storeId,
      reservationSlotId,
    );
  }

  @Get(':reservationSlotId/reservations')
  @ApiReservationSlotReservationsListDocs()
  listReservationsBySlot(
    @CurrentStoreId() storeId: number,
    @Param('reservationSlotId', ParseIntPipe) reservationSlotId: number,
  ) {
    return this.reservationsService.listReservationsBySlotForStore(
      storeId,
      reservationSlotId,
    );
  }
}

@ApiReservationSlotsStaffControllerDocs()
@UseGuards(JwtAuthGuard)
@Controller('reservations')
export class ReservationsBookingsStaffController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get(':id')
  @ApiReservationsGetOneDocs()
  getOne(
    @CurrentStoreId() storeId: number,
    @Param('id', ParseIntPipe) reservationId: number,
  ) {
    return this.reservationsService.getReservationForStore(storeId, reservationId);
  }

  @Post()
  @ApiReservationsCreateDocs()
  createReservationByStaff(
    @CurrentStoreId() storeId: number,
    @Body() dto: CreateReservationDto,
  ) {
    return this.reservationsService.createReservation(storeId, dto);
  }

  @Delete(':id')
  @ApiReservationsDeleteDocs()
  remove(
    @CurrentStoreId() storeId: number,
    @Param('id', ParseIntPipe) reservationId: number,
  ) {
    return this.reservationsService.softDeleteReservationForStore(
      storeId,
      reservationId,
    );
  }
}
