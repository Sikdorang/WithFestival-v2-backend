-- 메뉴 다국어(영/중/일) 컬럼 추가
ALTER TABLE `Menu`
  ADD COLUMN `nameEn` VARCHAR(200) NULL,
  ADD COLUMN `nameZh` VARCHAR(200) NULL,
  ADD COLUMN `nameJa` VARCHAR(200) NULL,
  ADD COLUMN `descriptionEn` TEXT NULL,
  ADD COLUMN `descriptionZh` TEXT NULL,
  ADD COLUMN `descriptionJa` TEXT NULL;
