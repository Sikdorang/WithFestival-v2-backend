import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiTableLikeCreateDocs,
  ApiTableLikeMyCountDocs,
  ApiTableLikeNicknameDocs,
  ApiTableLikeStoreListDocs,
  ApiTableLikesPublicControllerDocs,
} from '../swagger/table-likes/table-likes.swagger';
import { CreateTableLikeDto } from './dto/create-table-like.dto';
import {
  TableLikesService,
  type TableLikeCreateResult,
  type MyTableLikeCount,
  type StoreTableLikeSummary,
} from './table-likes.service';

@ApiTableLikesPublicControllerDocs()
@Controller()
export class TableLikesPublicController {
  constructor(private readonly tableLikesService: TableLikesService) {}

  @Post('table-likes')
  @ApiTableLikeCreateDocs()
  create(@Body() dto: CreateTableLikeDto): Promise<TableLikeCreateResult> {
    return this.tableLikesService.create(dto);
  }

  @Post('table-likes/nickname')
  @ApiTableLikeNicknameDocs()
  setNickname(@Body() dto: CreateTableLikeDto): Promise<TableLikeCreateResult> {
    return this.tableLikesService.setNickname(dto);
  }

  @Get('stores/:storeId/table-likes')
  @ApiTableLikeStoreListDocs()
  listByStore(
    @Param('storeId', ParseIntPipe) storeId: number,
  ): Promise<StoreTableLikeSummary[]> {
    return this.tableLikesService.listByStore(storeId);
  }

  @Get('table-likes/me')
  @ApiTableLikeMyCountDocs()
  getMyLikeCount(
    @Query('tokenUuid') tokenUuid: string,
  ): Promise<MyTableLikeCount> {
    return this.tableLikesService.getMyLikeCount(tokenUuid);
  }
}
