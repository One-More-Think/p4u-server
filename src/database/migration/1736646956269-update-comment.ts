import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateComment1736646956269 implements MigrationInterface {
    name = 'UpdateComment1736646956269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` ADD \`like\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD \`report\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`report\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`like\``);
    }

}
