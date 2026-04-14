-- WAITING(줄 대기) 추가. 과거 ENTERED 기본값이었던 행은 대기 중으로 간주해 WAITING으로 통일
ALTER TABLE `Waiting` MODIFY COLUMN `status` ENUM('WAITING', 'ENTERED', 'CANCELED') NOT NULL DEFAULT 'WAITING';

UPDATE `Waiting` SET `status` = 'WAITING' WHERE `status` = 'ENTERED';
