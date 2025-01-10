import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUseroption1736144637832 implements MigrationInterface {
    name = 'ChangeUseroption1736144637832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_options\` ADD \`questionId\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_options\` DROP COLUMN \`questionId\``);
    }

}
