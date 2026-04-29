import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionActiveDto } from './dto/update-mission-active.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';

@Injectable()
export class MissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(storeId: number, dto: CreateMissionDto) {
    return this.prisma.mission.create({
      data: {
        storeId,
        missionName: dto.missionName,
        description: dto.description,
        reward: dto.reward,
      },
    });
  }

  async listForStore(storeId: number) {
    return this.prisma.mission.findMany({
      where: { storeId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
  }

  async getOneForStore(storeId: number, missionId: number) {
    const row = await this.prisma.mission.findFirst({
      where: { id: missionId, storeId },
    });
    if (!row) {
      throw new NotFoundException('Mission not found for this store');
    }
    return row;
  }

  async updateForStore(storeId: number, missionId: number, dto: UpdateMissionDto) {
    await this.getOneForStore(storeId, missionId);
    return this.prisma.mission.update({
      where: { id: missionId },
      data: {
        missionName: dto.missionName,
        description: dto.description,
        reward: dto.reward,
      },
    });
  }

  async toggleActiveForStore(
    storeId: number,
    missionId: number,
    dto: UpdateMissionActiveDto,
  ) {
    await this.getOneForStore(storeId, missionId);
    return this.prisma.mission.update({
      where: { id: missionId },
      data: { isActive: dto.isActive },
    });
  }

  async deleteForStore(storeId: number, missionId: number) {
    await this.getOneForStore(storeId, missionId);
    return this.prisma.mission.delete({
      where: { id: missionId },
    });
  }
}
