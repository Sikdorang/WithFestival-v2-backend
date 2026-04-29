-- 예약 가능 시간대 테이블 추가
CREATE TABLE `ReservationSlot` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `storeId` INTEGER NOT NULL,
  `startTime` VARCHAR(32) NOT NULL,
  `endTime` VARCHAR(32) NOT NULL,
  `availableTables` INTEGER NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `ReservationSlot_storeId_idx`(`storeId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `ReservationSlot`
  ADD CONSTRAINT `ReservationSlot_storeId_fkey`
  FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
