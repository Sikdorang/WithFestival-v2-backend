-- AlterTable
ALTER TABLE `Menu` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `Menu_storeId_deletedAt_idx` ON `Menu`(`storeId`, `deletedAt`);
