import { Test as NestJsTest } from '@nestjs/testing/test';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../../config';
import { ArticleModule } from './article.module';
import { Connection } from 'typeorm/index';
import { TestingModule } from '@nestjs/testing';

describe('ArticleModule', () => {
  let module: TestingModule;
  let connection: Connection;

  beforeAll(async () => {
    module = await NestJsTest.createTestingModule({
      imports: [TypeOrmModule.forRoot(config.db), ArticleModule],
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
