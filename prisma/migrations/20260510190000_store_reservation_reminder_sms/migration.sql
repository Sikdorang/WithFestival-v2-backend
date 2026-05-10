-- 예약 N분 전 알림(5·10분) 스토어 설정
ALTER TABLE `Store`
  ADD COLUMN `reservationRemindSms5MinBefore` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `reservationRemindSms10MinBefore` BOOLEAN NOT NULL DEFAULT false;
