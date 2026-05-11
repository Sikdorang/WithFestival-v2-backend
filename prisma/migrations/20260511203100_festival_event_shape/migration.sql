ALTER TABLE `Festival`
  ADD COLUMN `university` VARCHAR(200) NOT NULL DEFAULT '',
  ADD COLUMN `startDate` VARCHAR(32) NOT NULL DEFAULT '',
  ADD COLUMN `endDate` VARCHAR(32) NOT NULL DEFAULT '';

UPDATE `Festival`
SET
  `startDate` = `period`,
  `endDate` = `period`
WHERE `period` IS NOT NULL;

ALTER TABLE `Festival`
  MODIFY `id` VARCHAR(191) NOT NULL,
  DROP COLUMN `period`,
  DROP COLUMN `createdAt`,
  DROP COLUMN `updatedAt`;

ALTER TABLE `Festival` ALTER COLUMN `university` DROP DEFAULT;
ALTER TABLE `Festival` ALTER COLUMN `startDate` DROP DEFAULT;
ALTER TABLE `Festival` ALTER COLUMN `endDate` DROP DEFAULT;
