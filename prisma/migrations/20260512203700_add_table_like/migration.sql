CREATE TABLE `TableLike` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `tokenUuid` VARCHAR(191) NOT NULL,
  `nickname` VARCHAR(200) NOT NULL,
  `storeId` INTEGER NOT NULL,
  `tableId` INTEGER NOT NULL,
  `likeCount` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `TableLike_tokenUuid_key` (`tokenUuid`),
  UNIQUE INDEX `TableLike_storeId_tableId_nickname_key` (`storeId`, `tableId`, `nickname`),
  INDEX `TableLike_storeId_tableId_idx` (`storeId`, `tableId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `TableLike`
  ADD CONSTRAINT `TableLike_storeId_fkey`
  FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
