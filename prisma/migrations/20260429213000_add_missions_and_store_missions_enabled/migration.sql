-- Store 전체 미션 기능 활성화 여부
ALTER TABLE `Store`
  ADD COLUMN `missionsEnabled` BOOLEAN NOT NULL DEFAULT false;

-- 부스별 Mission 테이블
CREATE TABLE `Mission` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `storeId` INTEGER NOT NULL,
  `missionName` VARCHAR(200) NOT NULL,
  `description` TEXT NULL,
  `reward` VARCHAR(500) NOT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `Mission_storeId_idx`(`storeId`),
  INDEX `Mission_storeId_isActive_idx`(`storeId`, `isActive`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Mission`
  ADD CONSTRAINT `Mission_storeId_fkey`
  FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
