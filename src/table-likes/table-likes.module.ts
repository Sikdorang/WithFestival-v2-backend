import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TableLikesPublicController } from './table-likes.controller';
import { TableLikesService } from './table-likes.service';

@Module({
  imports: [PrismaModule],
  controllers: [TableLikesPublicController],
  providers: [TableLikesService],
})
export class TableLikesModule {}
