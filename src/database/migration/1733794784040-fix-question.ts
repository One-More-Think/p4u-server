import { MigrationInterface, QueryRunner } from "typeorm";

export class FixQuestion1733794784040 implements MigrationInterface {
    name = 'FixQuestion1733794784040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questions\` CHANGE \`language\` \`language\` varchar(30) NOT NULL DEFAULT 'en'`);
        await queryRunner.query(`ALTER TABLE \`questions\` CHANGE \`category\` \`category\` enum ('0', '1', '2', '3') NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`questions\` CHANGE \`report\` \`report\` smallint NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questions\` CHANGE \`report\` \`report\` smallint NULL`);
        await queryRunner.query(`ALTER TABLE \`questions\` CHANGE \`category\` \`category\` enum ('0', '1', '2', '3') NULL`);
        await queryRunner.query(`ALTER TABLE \`questions\` CHANGE \`language\` \`language\` varchar(30) NULL`);
    }

}
