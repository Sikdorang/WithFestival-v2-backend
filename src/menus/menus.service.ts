import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Express } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { S3UploadService } from './s3-upload.service';

@Injectable()
export class MenusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3UploadService,
  ) {}

  /** `deleted === false` 인 메뉴만, id 오름차순 */
  listActiveByStore(storeId: number) {
    return this.prisma.menu.findMany({
      where: { storeId, deleted: false },
      orderBy: { id: 'asc' },
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

    return this.prisma.menu.create({
      data: {
        storeId,
        name: dto.name,
        price: dto.price ?? 0,
        description: dto.description?.length ? dto.description : null,
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
      price?: number;
      description?: string | null;
      imageUrl?: string;
    } = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.description !== undefined) {
      data.description = dto.description.length ? dto.description : null;
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
        'Provide at least one of: name, price, description, or image',
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
