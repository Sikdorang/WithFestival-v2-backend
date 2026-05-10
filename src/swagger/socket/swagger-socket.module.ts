import { Module } from '@nestjs/common';
import { SocketIoDocsController } from './socket.docs.controller';

@Module({
  controllers: [SocketIoDocsController],
})
export class SwaggerSocketModule {}
