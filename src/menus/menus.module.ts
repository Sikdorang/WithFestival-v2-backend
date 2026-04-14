import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';
import { S3UploadService } from './s3-upload.service';

@Module({
  imports: [AuthModule],
  controllers: [MenusController],
  providers: [MenusService, S3UploadService],
})
export class MenusModule {}
