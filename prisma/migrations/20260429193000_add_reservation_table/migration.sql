-- 실제 예약자 테이블 추가 (ReservationSlot 선택 후 생성)
CREATE TABLE `Reservation` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `reservationSlotId` INTEGER NOT NULL,
  `reserverName` VARCHAR(200) NOT NULL,
  `phoneNumber` VARCHAR(32) NOT NULL,
  `partySize` INTEGER NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `Reservation_reservationSlotId_idx`(`reservationSlotId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Reservation`
  ADD CONSTRAINT `Reservation_reservationSlotId_fkey`
  FOREIGN KEY (`reservationSlotId`) REFERENCES `ReservationSlot`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
