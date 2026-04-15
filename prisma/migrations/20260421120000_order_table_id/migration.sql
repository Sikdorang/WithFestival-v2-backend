-- Order: 테이블(좌석) id (기존 행이 있으면 임시 기본값 후 앱에서 구분)
ALTER TABLE `Order` ADD COLUMN `tableId` INTEGER NOT NULL DEFAULT 1;

CREATE INDEX `Order_storeId_tableId_idx` ON `Order`(`storeId`, `tableId`);
