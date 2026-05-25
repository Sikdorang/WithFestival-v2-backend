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

    const userTr = {
      nameEn: pickOrNull(dto.nameEn),
      nameZh: pickOrNull(dto.nameZh),
      nameJa: pickOrNull(dto.nameJa),
      descriptionEn: pickOrNull(dto.descriptionEn),
      descriptionZh: pickOrNull(dto.descriptionZh),
      descriptionJa: pickOrNull(dto.descriptionJa),
    };

    const needAutoName =
      !userTr.nameEn || !userTr.nameZh || !userTr.nameJa;
    const needAutoDesc =
      !!description &&
      (!userTr.descriptionEn ||
        !userTr.descriptionZh ||
        !userTr.descriptionJa);

    const auto =
      needAutoName || needAutoDesc
        ? await this.translation.translateMenuFields({
            name: needAutoName ? dto.name : null,
            description: needAutoDesc ? description : null,
          })
        : null;

    return this.prisma.menu.create({
      data: {
        storeId,
        name: dto.name,
        nameEn: userTr.nameEn ?? auto?.nameEn ?? null,
        nameZh: userTr.nameZh ?? auto?.nameZh ?? null,
        nameJa: userTr.nameJa ?? auto?.nameJa ?? null,
        price: dto.price ?? 0,
        marginRate: dto.marginRate ?? 0,
        description,
        descriptionEn: userTr.descriptionEn ?? auto?.descriptionEn ?? null,
        descriptionZh: userTr.descriptionZh ?? auto?.descriptionZh ?? null,
        descriptionJa: userTr.descriptionJa ?? auto?.descriptionJa ?? null,
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
    if (dto.nameEn !== undefined) {
      data.nameEn = dto.nameEn.length ? dto.nameEn : null;
    }
    if (dto.nameZh !== undefined) {
      data.nameZh = dto.nameZh.length ? dto.nameZh : null;
    }
    if (dto.nameJa !== undefined) {
      data.nameJa = dto.nameJa.length ? dto.nameJa : null;
    }
    if (dto.descriptionEn !== undefined) {
      data.descriptionEn = dto.descriptionEn.length ? dto.descriptionEn : null;
    }
    if (dto.descriptionZh !== undefined) {
      data.descriptionZh = dto.descriptionZh.length ? dto.descriptionZh : null;
    }
    if (dto.descriptionJa !== undefined) {
      data.descriptionJa = dto.descriptionJa.length ? dto.descriptionJa : null;
    }

    // 한국어 source가 이번 요청에서 바뀌었고, 같은 언어 override가 없으면 자동 재번역.
    const koreanNameChanged = dto.name !== undefined;
    const koreanDescChanged = dto.description !== undefined;

    const needAutoNameEn = koreanNameChanged && dto.nameEn === undefined;
    const needAutoNameZh = koreanNameChanged && dto.nameZh === undefined;
    const needAutoNameJa = koreanNameChanged && dto.nameJa === undefined;
    const needAutoDescEn =
      koreanDescChanged && dto.descriptionEn === undefined;
    const needAutoDescZh =
      koreanDescChanged && dto.descriptionZh === undefined;
    const needAutoDescJa =
      koreanDescChanged && dto.descriptionJa === undefined;

    const anyAutoName = needAutoNameEn || needAutoNameZh || needAutoNameJa;
    const anyAutoDesc = needAutoDescEn || needAutoDescZh || needAutoDescJa;

    if (anyAutoName || anyAutoDesc) {
      const newKoreanName = anyAutoName ? pickOrNull(data.name) : null;
      const newKoreanDesc = anyAutoDesc ? pickOrNull(data.description) : null;

      const auto =
        newKoreanName || newKoreanDesc
          ? await this.translation.translateMenuFields({
              name: newKoreanName,
              description: newKoreanDesc,
            })
          : null;

      if (anyAutoName) {
        if (newKoreanName) {
          if (needAutoNameEn) data.nameEn = auto?.nameEn ?? null;
          if (needAutoNameZh) data.nameZh = auto?.nameZh ?? null;
          if (needAutoNameJa) data.nameJa = auto?.nameJa ?? null;
        } else {
          if (needAutoNameEn) data.nameEn = null;
          if (needAutoNameZh) data.nameZh = null;
          if (needAutoNameJa) data.nameJa = null;
        }
      }

      if (anyAutoDesc) {
        if (newKoreanDesc) {
          if (needAutoDescEn) data.descriptionEn = auto?.descriptionEn ?? null;
          if (needAutoDescZh) data.descriptionZh = auto?.descriptionZh ?? null;
          if (needAutoDescJa) data.descriptionJa = auto?.descriptionJa ?? null;
        } else {
          if (needAutoDescEn) data.descriptionEn = null;
          if (needAutoDescZh) data.descriptionZh = null;
          if (needAutoDescJa) data.descriptionJa = null;
        }
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
        'Provide at least one of: name, price, marginRate, description, image, or any translation field (nameEn/nameZh/nameJa/descriptionEn/descriptionZh/descriptionJa)',
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
