-- Store 예약 기능 활성화 여부 컬럼 추가
ALTER TABLE `Store`
  ADD COLUMN `reservationEnabled` BOOLEAN NOT NULL DEFAULT false;
