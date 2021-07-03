import { Test as NestJsTest } from '@nestjs/testing/test';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../../config';
import { TestModule } from './test.module';
import { TestingModule } from '@nestjs/testing';
import { Connection } from 'typeorm/index';

describe('TestModule', () => {
  let module: TestingModule;
  let connection: Connection;

  beforeAll(async () => {
    module = await NestJsTest.createTestingModule({
      imports: [TypeOrmModule.forRoot(config.db), TestModule],
    }).compile();
    connection = module.get(Connection);
  });

  afterAll(async () => {
    await connection.close();
  });

  it(`should build module`, async () => {
    expect(module).toBeTruthy();
  });
});
