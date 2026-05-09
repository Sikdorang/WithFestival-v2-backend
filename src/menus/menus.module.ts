import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MenusController, MenusPublicController } from './menus.controller';
import { MenusService } from './menus.service';
import { S3UploadService } from './s3-upload.service';

@Module({
  imports: [AuthModule],
  controllers: [MenusController, MenusPublicController],
  providers: [MenusService, S3UploadService],
})
export class MenusModule {}
