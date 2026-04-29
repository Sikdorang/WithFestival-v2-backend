-- Reservation soft delete 컬럼 추가
ALTER TABLE `Reservation`
  ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX `Reservation_reservationSlotId_deleted_idx`
  ON `Reservation`(`reservationSlotId`, `deleted`);
