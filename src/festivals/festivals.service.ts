import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { UpdateFestivalDto } from './dto/update-festival.dto';

@Injectable()
export class FestivalsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateFestivalDto) {
    return this.prisma.festival.create({
      data: {
        university: dto.university,
        name: dto.name,
        startDate: dto.startDate,
        endDate: dto.endDate,
        location: dto.location,
      },
    });
  }

  findAll() {
    return this.prisma.festival.findMany({
      orderBy: [{ startDate: 'asc' }, { endDate: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string) {
    const row = await this.prisma.festival.findUnique({
      where: { id },
    });
    if (!row) {
      throw new NotFoundException(`Festival ${id} not found`);
    }
    return row;
  }

  async update(id: string, dto: UpdateFestivalDto) {
    const data: Prisma.FestivalUpdateInput = {};
    if (dto.university !== undefined) {
      const t = dto.university.trim();
      if (!t.length) {
        throw new BadRequestException('university는 비어 있을 수 없습니다.');
      }
      data.university = t;
    }
    if (dto.name !== undefined) {
      const t = dto.name.trim();
      if (!t.length) {
        throw new BadRequestException('name은 비어 있을 수 없습니다.');
      }
      data.name = t;
    }
    if (dto.startDate !== undefined) {
      const t = dto.startDate.trim();
      if (!t.length) {
        throw new BadRequestException('startDate는 비어 있을 수 없습니다.');
      }
      data.startDate = t;
    }
    if (dto.endDate !== undefined) {
      const t = dto.endDate.trim();
      if (!t.length) {
        throw new BadRequestException('endDate는 비어 있을 수 없습니다.');
      }
      data.endDate = t;
    }
    if (dto.location !== undefined) {
      const t = dto.location.trim();
      if (!t.length) {
        throw new BadRequestException('location은 비어 있을 수 없습니다.');
      }
      data.location = t;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException(
        '변경할 필드를 하나 이상 보내세요: university, name, startDate, endDate, location',
      );
    }

    try {
      return await this.prisma.festival.update({
        where: { id },
        data,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`Festival ${id} not found`);
      }
      throw e;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.festival.delete({
        where: { id },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`Festival ${id} not found`);
      }
      throw e;
    }
  }
}
