-- DropIndex
DROP INDEX `Menu_storeId_deletedAt_idx` ON `Menu`;

-- AlterTable
ALTER TABLE `Menu` DROP COLUMN `deletedAt`;

-- AlterTable
ALTER TABLE `Menu` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `Menu_storeId_deleted_idx` ON `Menu`(`storeId`, `deleted`);
