-- 주문 소프트 삭제 컬럼. 기존 행은 모두 `false`(=미삭제)로 시작.
ALTER TABLE `Order`
  ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT FALSE;
