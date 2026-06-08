-- DropForeignKey
ALTER TABLE `enquiries` DROP FOREIGN KEY `enquiries_property_id_fkey`;

-- AlterTable
ALTER TABLE `enquiries` MODIFY `property_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `enquiries` ADD CONSTRAINT `enquiries_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
