import { BadRequestException, Injectable } from '@nestjs/common';
import type { Express } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { S3UploadService } from './s3-upload.service';

@Injectable()
export class MenusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3UploadService,
  ) {}

  async createWithImage(
    storeId: number,
    file: Express.Multer.File | undefined,
    dto: CreateMenuDto,
  ) {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Image file (field name: image) is required');
    }

    const imageUrl = await this.s3.uploadMenuImage(
      storeId,
      file.buffer,
      file.mimetype,
    );

    return this.prisma.menu.create({
      data: {
        storeId,
        name: dto.name,
        price: dto.price,
        description: dto.description ?? null,
        imageUrl,
      },
    });
  }
}
