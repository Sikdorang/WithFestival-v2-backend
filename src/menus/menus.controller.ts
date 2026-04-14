import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentStoreId } from '../auth/decorators/current-store-id.decorator';
import {
  ApiMenuCreateDocs,
  ApiMenusControllerDocs,
} from '../swagger/menus/menus.swagger';
import { CreateMenuDto } from './dto/create-menu.dto';
import { MenusService } from './menus.service';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

@ApiMenusControllerDocs()
@UseGuards(JwtAuthGuard)
@Controller('stores/menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  @ApiMenuCreateDocs()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_IMAGE_BYTES },
    }),
  )
  create(
    @CurrentStoreId() storeId: number,
    @UploadedFile() image: Express.Multer.File | undefined,
    @Body() dto: CreateMenuDto,
  ) {
    return this.menusService.createWithImage(storeId, image, dto);
  }
}
