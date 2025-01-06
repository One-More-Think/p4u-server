import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeFieldAge1736113699027 implements MigrationInterface {
    name = 'ChangeFieldAge1736113699027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`age\` \`age\` smallint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`aboutMe\` \`aboutMe\` varchar(300) NULL COMMENT 'aboutme'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`aboutMe\` \`aboutMe\` varchar(300) NULL COMMENT '자기소개'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`age\` \`age\` smallint NULL`);
    }

}
