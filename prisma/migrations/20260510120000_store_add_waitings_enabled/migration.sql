-- Store 웨이팅 기능 활성화 여부 컬럼 추가
ALTER TABLE `Store`
  ADD COLUMN `waitingsEnabled` BOOLEAN NOT NULL DEFAULT false;
