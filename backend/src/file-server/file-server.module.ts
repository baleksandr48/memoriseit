import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileServerController } from './file-server.controller';
import { STATIC_DIR_NAME } from './const';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: `/${STATIC_DIR_NAME}`,
      rootPath: join(__dirname, '../../..', STATIC_DIR_NAME),
    }),
  ],
  controllers: [FileServerController],
})
export class FileServerModule {}
