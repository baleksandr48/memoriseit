import { MigrationInterface, QueryRunner } from 'typeorm';

export class initial1610880876847 implements MigrationInterface {
  name = 'initial1610880876847';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "contributor_type_enum" AS ENUM('CREATOR', 'EDITOR')`,
    );
    await queryRunner.query(
      `CREATE TABLE "contributor" ("id" SERIAL NOT NULL, "topicId" integer NOT NULL, "userEmail" character varying NOT NULL, "type" "contributor_type_enum" NOT NULL, CONSTRAINT "PK_816afef005b8100becacdeb6e58" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5c826cfcaec61b9212f3cc9c88" ON "contributor" ("topicId", "userEmail") `,
    );
    await queryRunner.query(
      `CREATE TABLE "topic" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_33aa4ecb4e4f20aa0157ea7ef61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "test_type_enum" AS ENUM('MULTIPLE', 'SINGLE', 'INPUT', 'ORDERING')`,
    );
    await queryRunner.query(
      `CREATE TABLE "test" ("id" SERIAL NOT NULL, "question" character varying NOT NULL, "type" "test_type_enum" NOT NULL, "answers" json NOT NULL, "articleId" integer NOT NULL, CONSTRAINT "PK_5417af0062cf987495b611b59c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "article" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "text" character varying DEFAULT '', "topicId" integer NOT NULL, "isGroup" boolean NOT NULL DEFAULT false, "parentId" integer DEFAULT null, "order" integer NOT NULL, CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributor" ADD CONSTRAINT "FK_ba9ce54c7cc983c23ee221cf269" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" ADD CONSTRAINT "FK_351b50471dde2832464acd3ce52" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ADD CONSTRAINT "FK_fdf08ff85f0004e90d3bcc4e8f2" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ADD CONSTRAINT "FK_b11531f1d42335f6c4672ecdda0" FOREIGN KEY ("parentId") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "article" DROP CONSTRAINT "FK_b11531f1d42335f6c4672ecdda0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" DROP CONSTRAINT "FK_fdf08ff85f0004e90d3bcc4e8f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test" DROP CONSTRAINT "FK_351b50471dde2832464acd3ce52"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributor" DROP CONSTRAINT "FK_ba9ce54c7cc983c23ee221cf269"`,
    );
    await queryRunner.query(`DROP TABLE "article"`);
    await queryRunner.query(`DROP TABLE "test"`);
    await queryRunner.query(`DROP TYPE "test_type_enum"`);
    await queryRunner.query(`DROP TABLE "topic"`);
    await queryRunner.query(`DROP INDEX "IDX_5c826cfcaec61b9212f3cc9c88"`);
    await queryRunner.query(`DROP TABLE "contributor"`);
    await queryRunner.query(`DROP TYPE "contributor_type_enum"`);
  }
}
