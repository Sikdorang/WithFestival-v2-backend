import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CreateReservationSlotDto } from './dto/create-reservation-slot.dto';
import { UpdateReservationSlotDto } from './dto/update-reservation-slot.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createForStore(storeId: number, dto: CreateReservationSlotDto) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });
    if (!store) {
      throw new NotFoundException('Store not found for this storeId');
    }

    return this.prisma.reservationSlot.create({
      data: {
        storeId: store.id,
        startTime: dto.startTime,
        endTime: dto.endTime,
        availableTables: dto.availableTables,
      },
    });
  }

  async listForStore(storeId: number) {
    return this.prisma.reservationSlot.findMany({
      where: { storeId },
      orderBy: [{ startTime: 'asc' }, { id: 'asc' }],
    });
  }

  async listForPublicStore(storeId: number) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });
    if (!store) {
      throw new NotFoundException('Store not found for this storeId');
    }

    return this.listForStore(store.id);
  }

  async updateSlotForStore(
    storeId: number,
    reservationSlotId: number,
    dto: UpdateReservationSlotDto,
  ) {
    const slot = await this.prisma.reservationSlot.findFirst({
      where: {
        id: reservationSlotId,
        storeId,
      },
      select: { id: true },
    });
    if (!slot) {
      throw new NotFoundException('Reservation slot not found for this store');
    }

    return this.prisma.reservationSlot.update({
      where: { id: slot.id },
      data: {
        startTime: dto.startTime,
        endTime: dto.endTime,
        availableTables: dto.availableTables,
      },
    });
  }

  async deleteSlotForStore(storeId: number, reservationSlotId: number) {
    const slot = await this.prisma.reservationSlot.findFirst({
      where: {
        id: reservationSlotId,
        storeId,
      },
      select: { id: true },
    });
    if (!slot) {
      throw new NotFoundException('Reservation slot not found for this store');
    }

    return this.prisma.reservationSlot.delete({
      where: { id: slot.id },
    });
  }

  async createReservation(storeId: number, dto: CreateReservationDto) {
    const slot = await this.prisma.reservationSlot.findFirst({
      where: {
        id: dto.reservationSlotId,
        storeId,
      },
      select: { id: true },
    });
    if (!slot) {
      throw new NotFoundException(
        'Reservation slot not found for this store and reservationSlotId',
      );
    }

    return this.prisma.reservation.create({
      data: {
        reservationSlotId: slot.id,
        reserverName: dto.reserverName,
        phoneNumber: dto.phoneNumber,
        partySize: dto.partySize,
      },
      include: {
        reservationSlot: true,
      },
    });
  }

  async listReservationsBySlotForStore(storeId: number, reservationSlotId: number) {
    const slot = await this.prisma.reservationSlot.findFirst({
      where: {
        id: reservationSlotId,
        storeId,
      },
      select: { id: true },
    });
    if (!slot) {
      throw new NotFoundException(
        'Reservation slot not found for this store and reservationSlotId',
      );
    }

    return this.prisma.reservation.findMany({
      where: {
        reservationSlotId: slot.id,
        deleted: false,
      },
      include: {
        reservationSlot: true,
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
  }

  async getReservationForStore(storeId: number, reservationId: number) {
    const row = await this.prisma.reservation.findFirst({
      where: {
        id: reservationId,
        deleted: false,
        reservationSlot: {
          storeId,
        },
      },
      include: {
        reservationSlot: true,
      },
    });
    if (!row) {
      throw new NotFoundException(
        'Reservation not found for this store or already deleted',
      );
    }

    return row;
  }

  async softDeleteReservationForStore(storeId: number, reservationId: number) {
    const row = await this.prisma.reservation.findFirst({
      where: {
        id: reservationId,
        deleted: false,
        reservationSlot: {
          storeId,
        },
      },
      select: { id: true },
    });
    if (!row) {
      throw new NotFoundException(
        'Reservation not found for this store or already deleted',
      );
    }

    return this.prisma.reservation.update({
      where: { id: row.id },
      data: { deleted: true },
      include: { reservationSlot: true },
    });
  }
}
