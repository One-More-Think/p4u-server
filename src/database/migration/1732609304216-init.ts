import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1732609304216 implements MigrationInterface {
  name = 'Init1732609304216';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`options\` (\`id\` int NOT NULL AUTO_INCREMENT, \`questionId\` int NOT NULL, \`context\` varchar(100) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="Option"`,
    );
    await queryRunner.query(
      `CREATE TABLE \`questions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`writerId\` int NOT NULL, \`language\` varchar(30) NULL, \`category\` enum ('0', '1', '2', '3') NULL, \`title\` varchar(300) NOT NULL, \`description\` varchar(500) NULL, \`report\` smallint NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="Question"`,
    );
    await queryRunner.query(
      `CREATE TABLE \`comments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`writerId\` int NOT NULL, \`questionId\` int NOT NULL, \`context\` varchar(100) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="Commented on question"`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`snsId\` varchar(300) NULL, \`snsType\` varchar(30) NULL, \`email\` varchar(300) NULL, \`country\` varchar(30) NULL, \`language\` varchar(30) NULL, \`gender\` varchar(30) NULL, \`age\` smallint NULL, \`occupation\` varchar(100) NULL, \`aboutMe\` varchar(300) NULL COMMENT '자기소개', \`isBanned\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="User"`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_options\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`optionId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="Selected options by users"`,
    );
    await queryRunner.query(
      `ALTER TABLE \`options\` ADD CONSTRAINT \`FK_46b668c49a6c4154d4643d875a5\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`questions\` ADD CONSTRAINT \`FK_8e79fb98c5bfe454b2c2019304c\` FOREIGN KEY (\`writerId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_be6da73fc5066b5c2eade9ccbdc\` FOREIGN KEY (\`writerId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_8db2a234357898ee18a16f5d409\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_options\` ADD CONSTRAINT \`FK_1f341e985ea1863d6eb58551229\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_options\` ADD CONSTRAINT \`FK_e57a3a74b017bbbe407673434cc\` FOREIGN KEY (\`optionId\`) REFERENCES \`options\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `CREATE TABLE \`query-result-cache\` (\`id\` int NOT NULL AUTO_INCREMENT, \`identifier\` varchar(255) NULL, \`time\` bigint NOT NULL, \`duration\` int NOT NULL, \`query\` text NOT NULL, \`result\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`query-result-cache\``);
    await queryRunner.query(
      `ALTER TABLE \`user_options\` DROP FOREIGN KEY \`FK_e57a3a74b017bbbe407673434cc\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_options\` DROP FOREIGN KEY \`FK_1f341e985ea1863d6eb58551229\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_8db2a234357898ee18a16f5d409\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_be6da73fc5066b5c2eade9ccbdc\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_8e79fb98c5bfe454b2c2019304c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`options\` DROP FOREIGN KEY \`FK_46b668c49a6c4154d4643d875a5\``,
    );
    await queryRunner.query(`DROP TABLE \`user_options\``);
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`comments\``);
    await queryRunner.query(`DROP TABLE \`questions\``);
    await queryRunner.query(`DROP TABLE \`options\``);
  }
}
