-- 기존 WAITING 행을 ENTERED로 옮긴 뒤 enum에서 제거
UPDATE `Waiting` SET `status` = 'ENTERED' WHERE `status` = 'WAITING';

ALTER TABLE `Waiting` MODIFY COLUMN `status` ENUM('ENTERED', 'CANCELED') NOT NULL DEFAULT 'ENTERED';
