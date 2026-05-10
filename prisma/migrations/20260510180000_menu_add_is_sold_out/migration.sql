-- 메뉴 품절 플래그
ALTER TABLE `Menu`
  ADD COLUMN `isSoldOut` BOOLEAN NOT NULL DEFAULT false;
