import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableLikeDto } from './dto/create-table-like.dto';

export type TableLikeCreateResult = {
  id: number;
  tokenUuid: string;
  nickname: string;
  storeId: number;
  tableId: number;
  likeCount: number;
  totalLikeCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type StoreTableLikeSummary = {
  storeId: number;
  tableId: number;
  totalLikeCount: number;
  likes: Array<{
    nickname: string;
    likeCount: number;
  }>;
};

export type MyTableLikeCount = {
  tokenUuid: string;
  storeId: number;
  tableId: number;
  nickname: string;
  likeCount: number;
};

@Injectable()
export class TableLikesService {
  constructor(private readonly prisma: PrismaService) {}

  async setNickname(dto: CreateTableLikeDto): Promise<TableLikeCreateResult> {
    await this.assertStoreExists(dto.storeId);

    const nickname = this.normalizeNickname(dto.nickname);
    const existing = await this.prisma.tableLike.findUnique({
      where: {
        storeId_tableId_nickname: {
          storeId: dto.storeId,
          tableId: dto.tableId,
          nickname,
        },
      },
    });

    const row =
      existing ??
      (await this.prisma.tableLike.create({
        data: {
          tokenUuid: randomUUID(),
          nickname,
          storeId: dto.storeId,
          tableId: dto.tableId,
          likeCount: 0,
        },
      }));

    const totalLikeCount = await this.sumLikes(dto.storeId, dto.tableId);
    return this.toCreateResult(row, totalLikeCount);
  }

  async create(dto: CreateTableLikeDto): Promise<TableLikeCreateResult> {
    await this.assertStoreExists(dto.storeId);

    const nickname = this.normalizeNickname(dto.nickname);

    const row = await this.prisma.tableLike.upsert({
      where: {
        storeId_tableId_nickname: {
          storeId: dto.storeId,
          tableId: dto.tableId,
          nickname,
        },
      },
      create: {
        tokenUuid: randomUUID(),
        nickname,
        storeId: dto.storeId,
        tableId: dto.tableId,
        likeCount: 1,
      },
      update: {
        likeCount: { increment: 1 },
      },
    });

    const totalLikeCount = await this.sumLikes(dto.storeId, dto.tableId);
    return this.toCreateResult(row, totalLikeCount);
  }

  async listByStore(storeId: number): Promise<StoreTableLikeSummary[]> {
    await this.assertStoreExists(storeId);

    const rows = await this.prisma.tableLike.findMany({
      where: { storeId },
      orderBy: [{ tableId: 'asc' }, { likeCount: 'desc' }, { nickname: 'asc' }],
      select: {
        tableId: true,
        nickname: true,
        likeCount: true,
      },
    });

    const byTable = new Map<number, StoreTableLikeSummary>();
    for (const row of rows) {
      let summary = byTable.get(row.tableId);
      if (!summary) {
        summary = {
          storeId,
          tableId: row.tableId,
          totalLikeCount: 0,
          likes: [],
        };
        byTable.set(row.tableId, summary);
      }
      summary.totalLikeCount += row.likeCount;
      summary.likes.push({
        nickname: row.nickname,
        likeCount: row.likeCount,
      });
    }

    return [...byTable.values()];
  }

  async getMyLikeCount(tokenUuid: string | undefined): Promise<MyTableLikeCount> {
    const normalizedToken = tokenUuid?.trim();
    if (!normalizedToken?.length) {
      throw new BadRequestException('tokenUuid는 빈 문자열일 수 없습니다.');
    }

    const row = await this.prisma.tableLike.findUnique({
      where: { tokenUuid: normalizedToken },
    });
    if (!row) {
      throw new NotFoundException('TableLike token not found');
    }

    return {
      tokenUuid: row.tokenUuid,
      storeId: row.storeId,
      tableId: row.tableId,
      nickname: row.nickname,
      likeCount: row.likeCount,
    };
  }

  private async assertStoreExists(storeId: number): Promise<void> {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });
    if (!store) {
      throw new NotFoundException(`Store ${storeId} not found`);
    }
  }

  private async sumLikes(storeId: number, tableId: number): Promise<number> {
    const result = await this.prisma.tableLike.aggregate({
      where: { storeId, tableId },
      _sum: { likeCount: true },
    });
    return result._sum.likeCount ?? 0;
  }

  private normalizeNickname(nickname: string): string {
    const normalized = nickname.trim();
    if (!normalized.length) {
      throw new BadRequestException('nickname은 빈 문자열일 수 없습니다.');
    }
    return normalized;
  }

  private toCreateResult(
    row: {
      id: number;
      tokenUuid: string;
      nickname: string;
      storeId: number;
      tableId: number;
      likeCount: number;
      createdAt: Date;
      updatedAt: Date;
    },
    totalLikeCount: number,
  ): TableLikeCreateResult {
    return {
      id: row.id,
      tokenUuid: row.tokenUuid,
      nickname: row.nickname,
      storeId: row.storeId,
      tableId: row.tableId,
      likeCount: row.likeCount,
      totalLikeCount,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
