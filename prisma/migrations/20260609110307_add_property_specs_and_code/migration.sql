-- AlterTable
ALTER TABLE `properties` ADD COLUMN `property_code` VARCHAR(191) NULL,
    ADD COLUMN `unit_type` VARCHAR(191) NOT NULL DEFAULT '1 BHK';

-- CreateTable
CREATE TABLE `property_specifications` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `property_id` VARCHAR(191) NOT NULL,

    INDEX `property_specifications_property_id_idx`(`property_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `property_specifications` ADD CONSTRAINT `property_specifications_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
