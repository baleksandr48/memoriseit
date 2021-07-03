import {MigrationInterface, QueryRunner} from "typeorm";

export class addUser1616957202197 implements MigrationInterface {
    name = 'addUser1616957202197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_5c826cfcaec61b9212f3cc9c88"`);
        await queryRunner.query(`ALTER TABLE "contributor" RENAME COLUMN "userEmail" TO "userId"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contributor" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_b11531f1d42335f6c4672ecdda0"`);
        await queryRunner.query(`COMMENT ON COLUMN "article"."parentId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "parentId" SET DEFAULT null`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_409382f3033ecf36e6f4ff186a" ON "contributor" ("topicId", "userId") `);
        await queryRunner.query(`ALTER TABLE "contributor" ADD CONSTRAINT "FK_4be92df1dfa5c24a494e3f6b330" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_b11531f1d42335f6c4672ecdda0" FOREIGN KEY ("parentId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_b11531f1d42335f6c4672ecdda0"`);
        await queryRunner.query(`ALTER TABLE "contributor" DROP CONSTRAINT "FK_4be92df1dfa5c24a494e3f6b330"`);
        await queryRunner.query(`DROP INDEX "IDX_409382f3033ecf36e6f4ff186a"`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "parentId" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "article"."parentId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_b11531f1d42335f6c4672ecdda0" FOREIGN KEY ("parentId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contributor" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "contributor" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "contributor" RENAME COLUMN "userId" TO "userEmail"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5c826cfcaec61b9212f3cc9c88" ON "contributor" ("topicId", "userEmail") `);
    }

}
