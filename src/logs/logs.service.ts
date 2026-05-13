import { BadRequestException, Injectable } from '@nestjs/common';
import type { Log } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLogDto): Promise<Log> {
    const identifier = dto.identifier.trim();
    const action = dto.action.trim();
    if (!identifier.length) {
      throw new BadRequestException('identifier는 빈 문자열일 수 없습니다.');
    }
    if (!action.length) {
      throw new BadRequestException('action은 빈 문자열일 수 없습니다.');
    }

    return this.prisma.log.create({
      data: {
        identifier,
        action,
        storeId: dto.storeId,
      },
    });
  }
}
