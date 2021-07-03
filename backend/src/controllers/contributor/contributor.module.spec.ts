import { Test as NestJsTest } from '@nestjs/testing/test';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../../config';
import { Connection } from 'typeorm/index';
import { TestingModule } from '@nestjs/testing';
import { ContributorModule } from './contributor.module';

describe('ContributorModule', () => {
  let module: TestingModule;
  let connection: Connection;

  beforeAll(async () => {
    module = await NestJsTest.createTestingModule({
      imports: [TypeOrmModule.forRoot(config.db), ContributorModule],
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
