CREATE TABLE `Coupon` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `storeId` INTEGER NOT NULL,
  `code` VARCHAR(64) NOT NULL,
  `discountPrice` INTEGER NOT NULL,
  `used` BOOLEAN NOT NULL DEFAULT false,

  PRIMARY KEY (`id`),
  UNIQUE INDEX `Coupon_storeId_code_key`(`storeId`, `code`),
  INDEX `Coupon_storeId_idx`(`storeId`),
  CONSTRAINT `Coupon_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);
