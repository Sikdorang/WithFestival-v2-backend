import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
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
  ApiMenuDeleteDocs,
  ApiMenuListDocs,
  ApiMenuPatchDocs,
  ApiMenusControllerDocs,
} from '../swagger/menus/menus.swagger';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenusService } from './menus.service';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

@ApiMenusControllerDocs()
@UseGuards(JwtAuthGuard)
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  @ApiMenuListDocs()
  list(@CurrentStoreId() storeId: number) {
    return this.menusService.listActiveByStore(storeId);
  }

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

  @Patch(':id')
  @ApiMenuPatchDocs()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_IMAGE_BYTES },
    }),
  )
  update(
    @CurrentStoreId() storeId: number,
    @Param('id', ParseIntPipe) menuId: number,
    @UploadedFile() image: Express.Multer.File | undefined,
    @Body() dto: UpdateMenuDto,
  ) {
    return this.menusService.updateWithOptionalImage(
      storeId,
      menuId,
      image,
      dto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiMenuDeleteDocs()
  remove(
    @CurrentStoreId() storeId: number,
    @Param('id', ParseIntPipe) menuId: number,
  ) {
    return this.menusService.remove(storeId, menuId);
  }
}
