import {MigrationInterface, QueryRunner} from "typeorm";

export class addTestResults1625312291098 implements MigrationInterface {
    name = 'addTestResults1625312291098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "test_result" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "articleId" integer NOT NULL, "result" double precision NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), CONSTRAINT "PK_95770fb76248f4c3def5de11a72" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_b11531f1d42335f6c4672ecdda0"`);
        await queryRunner.query(`COMMENT ON COLUMN "article"."parentId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "parentId" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "test_result" ADD CONSTRAINT "FK_093cb4d40ed2b217d4e31a17220" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test_result" ADD CONSTRAINT "FK_2de46e54dc37afa5bbb383c2c10" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_b11531f1d42335f6c4672ecdda0" FOREIGN KEY ("parentId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_b11531f1d42335f6c4672ecdda0"`);
        await queryRunner.query(`ALTER TABLE "test_result" DROP CONSTRAINT "FK_2de46e54dc37afa5bbb383c2c10"`);
        await queryRunner.query(`ALTER TABLE "test_result" DROP CONSTRAINT "FK_093cb4d40ed2b217d4e31a17220"`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "parentId" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "article"."parentId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_b11531f1d42335f6c4672ecdda0" FOREIGN KEY ("parentId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "test_result"`);
    }

}
