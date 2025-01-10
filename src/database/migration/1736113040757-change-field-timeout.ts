import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeFieldTimeout1736113040757 implements MigrationInterface {
    name = 'ChangeFieldTimeout1736113040757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`timeout\``);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD \`timeout\` bigint NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`timeout\``);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD \`timeout\` int NOT NULL DEFAULT 0`);
    }

}
