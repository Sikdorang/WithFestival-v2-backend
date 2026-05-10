-- 메뉴 마진율(정수 %, 기본 0)
ALTER TABLE `Menu`
  ADD COLUMN `marginRate` INTEGER NOT NULL DEFAULT 0;
