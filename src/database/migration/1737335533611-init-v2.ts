import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitV21737335533611 implements MigrationInterface {
  name = 'InitV21737335533611';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE `user_options` (`id` int NOT NULL AUTO_INCREMENT, `userId` int NOT NULL, `optionId` int NOT NULL, `questionId` int NOT NULL DEFAULT \'0\', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB COMMENT="Selected options by users"');
    await queryRunner.query('CREATE TABLE `options` (`id` int NOT NULL AUTO_INCREMENT, `questionId` int NOT NULL, `context` varchar(100) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB COMMENT="Option"');
    await queryRunner.query('CREATE TABLE `questions` (`id` int NOT NULL AUTO_INCREMENT, `writerId` int NOT NULL, `language` varchar(30) NOT NULL DEFAULT \'en\', `category` enum (\'0\', \'1\', \'2\', \'3\') NOT NULL DEFAULT \'0\', `title` varchar(300) NOT NULL, `description` varchar(500) NULL, `report` smallint NOT NULL DEFAULT \'0\', `timeout` bigint NOT NULL DEFAULT \'0\', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB COMMENT="Question"');
    await queryRunner.query('CREATE TABLE `comment_reactions` (`id` int NOT NULL AUTO_INCREMENT, `userId` int NOT NULL, `commentId` int NOT NULL, `isLike` tinyint NOT NULL DEFAULT 0, `isDislike` tinyint NOT NULL DEFAULT 0, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB COMMENT="Reactions to comments"');
    await queryRunner.query('CREATE TABLE `comments` (`id` int NOT NULL AUTO_INCREMENT, `writerId` int NOT NULL, `questionId` int NOT NULL, `context` varchar(100) NULL, `like` int NOT NULL DEFAULT \'0\', `report` int NOT NULL DEFAULT \'0\', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB COMMENT="Commented on question"');
    await queryRunner.query('CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `snsId` varchar(300) NULL, `snsType` varchar(30) NULL, `email` varchar(300) NULL, `country` varchar(30) NULL, `language` varchar(30) NULL, `gender` varchar(30) NULL, `age` smallint NOT NULL DEFAULT \'0\', `occupation` varchar(100) NULL, `aboutMe` varchar(300) NULL COMMENT \'aboutme\', `isBanned` tinyint NOT NULL DEFAULT 0, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB COMMENT="User"');
    await queryRunner.query('ALTER TABLE `user_options` ADD CONSTRAINT `FK_1f341e985ea1863d6eb58551229` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE');
    await queryRunner.query('ALTER TABLE `user_options` ADD CONSTRAINT `FK_e57a3a74b017bbbe407673434cc` FOREIGN KEY (`optionId`) REFERENCES `options`(`id`) ON DELETE CASCADE ON UPDATE CASCADE');
    await queryRunner.query('ALTER TABLE `options` ADD CONSTRAINT `FK_46b668c49a6c4154d4643d875a5` FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE');
    await queryRunner.query('ALTER TABLE `questions` ADD CONSTRAINT `FK_8e79fb98c5bfe454b2c2019304c` FOREIGN KEY (`writerId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE');
    await queryRunner.query('ALTER TABLE `comment_reactions` ADD CONSTRAINT `FK_b9fbc058a6dd52aec6c76f9b58a` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE');
    await queryRunner.query('ALTER TABLE `comment_reactions` ADD CONSTRAINT `FK_ab02238d3deb62cba37aa8047dd` FOREIGN KEY (`commentId`) REFERENCES `comments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE');
    await queryRunner.query('ALTER TABLE `comments` ADD CONSTRAINT `FK_be6da73fc5066b5c2eade9ccbdc` FOREIGN KEY (`writerId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE');
    await queryRunner.query('ALTER TABLE `comments` ADD CONSTRAINT `FK_8db2a234357898ee18a16f5d409` FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE');
    await queryRunner.query('CREATE TABLE `query-result-cache` (`id` int NOT NULL AUTO_INCREMENT, `identifier` varchar(255) NULL, `time` bigint NOT NULL, `duration` int NOT NULL, `query` text NOT NULL, `result` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB');
    await queryRunner.query('INSERT INTO `users` (snsId, snsType, email, country, language, gender, occupation, aboutMe) VALUES ("sns_id_1", "apple", "apple1@icloud.com", "en", "en", "male", "developer", "hi, I am developer"), ("sis_id_2", "google", "google2@gmail.com", "en", "en", "female", "teacher", "hi, I am teacher"), ("sis_id_3", "google", "google3@gmail.com", "en", "en", "male", "restaurant manager", "hi, I am restaurant manager"), ("sis_id_4", "apple", "apple4@icloud.com", "en", "en", "female", "football player", "hi, I am football player"), ("sis_id_5", "google", "google5@gmail.com", "en", "en", "male", "student", "hi, I am student"), ("1234", "kakao", "admin", "en", "en", "male", "Administrator", "Hi, I am administrator")');
    await queryRunner.query('INSERT INTO questions (writerId, title, description) VALUES (1, "Q1", "blabla"), (2, "Q2", "blabla"), (2, "Q3", "blabla"), (3, "Q4", "blabla"), (5, "Q5", "blabla"), (5, "Q6", "blabla")');
    await queryRunner.query('INSERT INTO options (questionId, context) VALUES (1, "A"),(1, "B"), (1, "C"), (2, "A"), (2, "B"), (2, "C"), (3, "A"), (3, "B"), (3, "C"), (4, "A"), (4, "B"), (4, "C"), (5, "A"), (5, "B"), (5, "C"), (6, "A"), (6, "B"), (6, "C")');
    await queryRunner.query('INSERT INTO comments (writerId, questionId, context) VALUES (1, 6, "Hala Madrid~!"), (2, 6, "Vamos~!"), (3, 6, "Mbappeé!!!!!!"), (5, 6, "Siu~!~!~~!!")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `query-result-cache`');
    await queryRunner.query('ALTER TABLE `comments` DROP FOREIGN KEY `FK_8db2a234357898ee18a16f5d409`');
    await queryRunner.query('ALTER TABLE `comments` DROP FOREIGN KEY `FK_be6da73fc5066b5c2eade9ccbdc`');
    await queryRunner.query('ALTER TABLE `comment_reactions` DROP FOREIGN KEY `FK_ab02238d3deb62cba37aa8047dd`');
    await queryRunner.query('ALTER TABLE `comment_reactions` DROP FOREIGN KEY `FK_b9fbc058a6dd52aec6c76f9b58a`');
    await queryRunner.query('ALTER TABLE `questions` DROP FOREIGN KEY `FK_8e79fb98c5bfe454b2c2019304c`');
    await queryRunner.query('ALTER TABLE `options` DROP FOREIGN KEY `FK_46b668c49a6c4154d4643d875a5`');
    await queryRunner.query('ALTER TABLE `user_options` DROP FOREIGN KEY `FK_e57a3a74b017bbbe407673434cc`');
    await queryRunner.query('ALTER TABLE `user_options` DROP FOREIGN KEY `FK_1f341e985ea1863d6eb58551229`');
    await queryRunner.query('DROP TABLE `users`');
    await queryRunner.query('DROP TABLE `comments`');
    await queryRunner.query('DROP TABLE `comment_reactions`');
    await queryRunner.query('DROP TABLE `questions`');
    await queryRunner.query('DROP TABLE `options`');
    await queryRunner.query('DROP TABLE `user_options`');
  }

}
