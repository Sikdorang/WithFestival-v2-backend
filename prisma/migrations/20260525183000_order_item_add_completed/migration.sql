-- 주문 품목 단위 완료 처리 플래그(기본 false)
ALTER TABLE `OrderItem`
  ADD COLUMN `completed` BOOLEAN NOT NULL DEFAULT false;
