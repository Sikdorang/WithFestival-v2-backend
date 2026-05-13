CREATE TABLE `Log` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `identifier` VARCHAR(191) NOT NULL,
  `action` VARCHAR(200) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  INDEX `Log_identifier_idx` (`identifier`),
  INDEX `Log_createdAt_idx` (`createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
