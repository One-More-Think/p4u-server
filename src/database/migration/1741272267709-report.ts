import { MigrationInterface, QueryRunner } from 'typeorm';

export class Report1741272267709 implements MigrationInterface {
  name = 'Report1741272267709';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`question_reports\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`questionId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="Report to questions"`,
    );
    await queryRunner.query(
      `CREATE TABLE \`comment_reports\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`commentId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="Report to comments"`,
    );
    await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`report\``);
    await queryRunner.query(
      `ALTER TABLE \`question_reports\` ADD CONSTRAINT \`FK_636a2d8de4e2a4bf35291bca85f\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`question_reports\` ADD CONSTRAINT \`FK_1ceced1c04fff43678aa8f91788\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment_reports\` ADD CONSTRAINT \`FK_c07529dc1dcdac9d5eecdb4edaa\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment_reports\` ADD CONSTRAINT \`FK_14ce729bcc2ec2f7c16b11b2d9e\` FOREIGN KEY (\`commentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comment_reports\` DROP FOREIGN KEY \`FK_14ce729bcc2ec2f7c16b11b2d9e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment_reports\` DROP FOREIGN KEY \`FK_c07529dc1dcdac9d5eecdb4edaa\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`question_reports\` DROP FOREIGN KEY \`FK_1ceced1c04fff43678aa8f91788\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`question_reports\` DROP FOREIGN KEY \`FK_636a2d8de4e2a4bf35291bca85f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD \`report\` int NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(`DROP TABLE \`comment_reports\``);
    await queryRunner.query(`DROP TABLE \`question_reports\``);
  }
}
