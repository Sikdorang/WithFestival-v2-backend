import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Express } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { TranslationService } from '../translation/translation.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { S3UploadService } from './s3-upload.service';

export type MenuPublicRow = {
  id: number;
  storeId: number;
  name: string;
  nameEn: string | null;
  nameZh: string | null;
  nameJa: string | null;
  price: number;
  marginRate: number;
  isSoldOut: boolean;
  description: string | null;
  descriptionEn: string | null;
  descriptionZh: string | null;
  descriptionJa: string | null;
  imageUrl: string | null;
};

@Injectable()
export class MenusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3UploadService,
    private readonly translation: TranslationService,
  ) {}

  /** `deleted === false` 인 메뉴만, id 오름차순 */
  listActiveByStore(storeId: number) {
    return this.prisma.menu.findMany({
      where: { storeId, deleted: false },
      orderBy: { id: 'asc' },
    });
  }

  /** 고객용: 스토어 존재 확인 후 활성 메뉴만, 민감 필드 제외 */
  async listPublicByStore(storeId: number): Promise<MenuPublicRow[]> {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });
    if (!store) {
      throw new NotFoundException(`Store ${storeId} not found`);
    }

    return this.prisma.menu.findMany({
      where: { storeId, deleted: false },
      orderBy: { id: 'asc' },
      select: {
        id: true,
        storeId: true,
        name: true,
        nameEn: true,
        nameZh: true,
        nameJa: true,
        price: true,
        marginRate: true,
        isSoldOut: true,
        description: true,
        descriptionEn: true,
        descriptionZh: true,
        descriptionJa: true,
        imageUrl: true,
      },
    });
  }

  /** 활성 메뉴만 품절(`isSoldOut: true`)로 설정 */
  async markSoldOut(storeId: number, menuId: number) {
    const existing = await this.prisma.menu.findFirst({
      where: { id: menuId, storeId, deleted: false },
    });
    if (!existing) {
      throw new NotFoundException('Menu not found for this store');
    }
    return this.prisma.menu.update({
      where: { id: menuId },
      data: { isSoldOut: true },
    });
  }

  /** 활성 메뉴만 판매 재개(`isSoldOut: false`) */
  async markAvailable(storeId: number, menuId: number) {
    const existing = await this.prisma.menu.findFirst({
      where: { id: menuId, storeId, deleted: false },
    });
    if (!existing) {
      throw new NotFoundException('Menu not found for this store');
    }
    return this.prisma.menu.update({
      where: { id: menuId },
      data: { isSoldOut: false },
    });
  }

  async createWithImage(
    storeId: number,
    file: Express.Multer.File | undefined,
    dto: CreateMenuDto,
  ) {
    let imageUrl: string | null = null;
    if (file?.buffer?.length) {
      imageUrl = await this.s3.uploadMenuImage(
        storeId,
        file.buffer,
        file.mimetype,
      );
    }

    const description = pickOrNull(dto.description);

    const translated = await this.translation.translateMenuFields({
      name: dto.name,
      description,
    });

    return this.prisma.menu.create({
      data: {
        storeId,
        name: dto.name,
        nameEn: translated.nameEn,
        nameZh: translated.nameZh,
        nameJa: translated.nameJa,
        price: dto.price ?? 0,
        marginRate: dto.marginRate ?? 0,
        description,
        descriptionEn: translated.descriptionEn,
        descriptionZh: translated.descriptionZh,
        descriptionJa: translated.descriptionJa,
        imageUrl,
      },
    });
  }

  async updateWithOptionalImage(
    storeId: number,
    menuId: number,
    file: Express.Multer.File | undefined,
    dto: UpdateMenuDto,
  ) {
    const existing = await this.prisma.menu.findFirst({
      where: { id: menuId, storeId, deleted: false },
    });
    if (!existing) {
      throw new NotFoundException('Menu not found for this store');
    }

    const data: {
      name?: string;
      nameEn?: string | null;
      nameZh?: string | null;
      nameJa?: string | null;
      price?: number;
      marginRate?: number;
      description?: string | null;
      descriptionEn?: string | null;
      descriptionZh?: string | null;
      descriptionJa?: string | null;
      imageUrl?: string;
    } = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.marginRate !== undefined) data.marginRate = dto.marginRate;
    if (dto.description !== undefined) {
      data.description = dto.description.length ? dto.description : null;
    }

    // 한국어 source가 이번 요청에서 바뀌었으면 영/중/일을 통째로 재번역.
    // 한국어가 비어있으면(description만 해당) 해당 번역 컬럼도 null로 정리.
    const koreanNameChanged = dto.name !== undefined;
    const koreanDescChanged = dto.description !== undefined;

    if (koreanNameChanged || koreanDescChanged) {
      const newKoreanName = koreanNameChanged ? pickOrNull(data.name) : null;
      const newKoreanDesc = koreanDescChanged
        ? pickOrNull(data.description)
        : null;

      const auto =
        newKoreanName || newKoreanDesc
          ? await this.translation.translateMenuFields({
              name: newKoreanName,
              description: newKoreanDesc,
            })
          : null;

      if (koreanNameChanged) {
        data.nameEn = newKoreanName ? (auto?.nameEn ?? null) : null;
        data.nameZh = newKoreanName ? (auto?.nameZh ?? null) : null;
        data.nameJa = newKoreanName ? (auto?.nameJa ?? null) : null;
      }
      if (koreanDescChanged) {
        data.descriptionEn = newKoreanDesc
          ? (auto?.descriptionEn ?? null)
          : null;
        data.descriptionZh = newKoreanDesc
          ? (auto?.descriptionZh ?? null)
          : null;
        data.descriptionJa = newKoreanDesc
          ? (auto?.descriptionJa ?? null)
          : null;
      }
    }

    if (file?.buffer?.length) {
      data.imageUrl = await this.s3.uploadMenuImage(
        storeId,
        file.buffer,
        file.mimetype,
      );
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException(
        'Provide at least one of: name, price, marginRate, description, or image',
      );
    }

    return this.prisma.menu.update({
      where: { id: menuId },
      data,
    });
  }

  async remove(storeId: number, menuId: number): Promise<void> {
    const menu = await this.prisma.menu.findFirst({
      where: { id: menuId, storeId, deleted: false },
    });
    if (!menu) {
      throw new NotFoundException('Menu not found for this store');
    }
    await this.prisma.menu.update({
      where: { id: menuId },
      data: { deleted: true },
    });
  }
}

/** 빈 문자열·undefined·null·공백만 → null, 그 외엔 원문 그대로 */
function pickOrNull(value: string | null | undefined): string | null {
  if (value === undefined || value === null) return null;
  return value.length ? value : null;
}
