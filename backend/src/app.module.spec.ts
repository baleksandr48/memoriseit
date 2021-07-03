import { Test as NestJsTest } from '@nestjs/testing/test';
import { Connection } from 'typeorm/index';
import { TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';

describe('AppModule', () => {
  let module: TestingModule;
  let connection: Connection;

  beforeAll(async () => {
    module = await NestJsTest.createTestingModule({
      imports: [AppModule],
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
