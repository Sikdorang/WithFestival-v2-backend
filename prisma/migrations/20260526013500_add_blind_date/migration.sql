-- 소개팅 명단 테이블 생성
CREATE TABLE `BlindDate` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `age` INTEGER NOT NULL,
  `contact` VARCHAR(200) NOT NULL,
  `mbti` VARCHAR(8) NOT NULL,
  `appearanceStyle` INTEGER NOT NULL,
  `gender` ENUM('MALE', 'FEMALE') NOT NULL,
  `numberDelivered` BOOLEAN NOT NULL DEFAULT false,
  `deliveryPhone` VARCHAR(32) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `BlindDate_gender_numberDelivered_idx` (`gender`, `numberDelivered`),
  INDEX `BlindDate_createdAt_idx` (`createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
