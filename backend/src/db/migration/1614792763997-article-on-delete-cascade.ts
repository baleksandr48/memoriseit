import {MigrationInterface, QueryRunner} from "typeorm";

export class articleOnDeleteCascade1614792763997 implements MigrationInterface {
    name = 'articleOnDeleteCascade1614792763997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_b11531f1d42335f6c4672ecdda0"`);
        await queryRunner.query(`COMMENT ON COLUMN "article"."parentId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "parentId" SET DEFAULT null`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_b11531f1d42335f6c4672ecdda0" FOREIGN KEY ("parentId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_b11531f1d42335f6c4672ecdda0"`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "parentId" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "article"."parentId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_b11531f1d42335f6c4672ecdda0" FOREIGN KEY ("parentId") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
