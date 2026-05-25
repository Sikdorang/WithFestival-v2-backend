-- 쿠폰 할인 유형 추가: AMOUNT(정액) | PERCENT(정률). 기존 행은 정액 할인이었으므로 AMOUNT.
ALTER TABLE `Coupon`
  ADD COLUMN `type` ENUM('AMOUNT', 'PERCENT') NOT NULL DEFAULT 'AMOUNT';
