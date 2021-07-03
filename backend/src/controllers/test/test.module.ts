import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { Test } from '../../models/test.model';
import { TestResults } from '../../models/test-results.model';

@Module({
  imports: [TypeOrmModule.forFeature([Test, TestResults])],
  providers: [TestService],
  controllers: [TestController],
  exports: [TestService],
})
export class TestModule {}
