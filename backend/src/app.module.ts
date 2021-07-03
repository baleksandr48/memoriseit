import { Module } from '@nestjs/common';
import { config } from './config';
import { ControllersModule } from './controllers/controllers.module';
import { FileServerModule } from './file-server/file-server.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    FileServerModule,
    TypeOrmModule.forRoot(config.db),
    ControllersModule,
  ],
})
export class AppModule {}
