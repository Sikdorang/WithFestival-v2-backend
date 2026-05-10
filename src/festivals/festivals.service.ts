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
        name: dto.name,
        location: dto.location,
        period: dto.period,
      },
    });
  }

  findAll() {
    return this.prisma.festival.findMany({
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const row = await this.prisma.festival.findUnique({
      where: { id },
    });
    if (!row) {
      throw new NotFoundException(`Festival ${id} not found`);
    }
    return row;
  }

  async update(id: number, dto: UpdateFestivalDto) {
    const data: Prisma.FestivalUpdateInput = {};
    if (dto.name !== undefined) {
      const t = dto.name.trim();
      if (!t.length) {
        throw new BadRequestException('name은 비어 있을 수 없습니다.');
      }
      data.name = t;
    }
    if (dto.location !== undefined) {
      const t = dto.location.trim();
      if (!t.length) {
        throw new BadRequestException('location은 비어 있을 수 없습니다.');
      }
      data.location = t;
    }
    if (dto.period !== undefined) {
      const t = dto.period.trim();
      if (!t.length) {
        throw new BadRequestException('period는 비어 있을 수 없습니다.');
      }
      data.period = t;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException(
        '변경할 필드를 하나 이상 보내세요: name, location, period',
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

  async remove(id: number): Promise<void> {
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
