-- AlterTable
ALTER TABLE `properties` ADD COLUMN `amenities` JSON NULL,
    ADD COLUMN `builder_address` VARCHAR(191) NULL,
    ADD COLUMN `builder_name` VARCHAR(191) NULL,
    ADD COLUMN `builder_phone` VARCHAR(191) NULL,
    ADD COLUMN `facing` VARCHAR(191) NULL,
    ADD COLUMN `is_corner` BOOLEAN NOT NULL DEFAULT false;
