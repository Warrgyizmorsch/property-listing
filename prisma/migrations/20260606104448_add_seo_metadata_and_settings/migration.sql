-- AlterTable
ALTER TABLE `properties` ADD COLUMN `meta_description` TEXT NULL,
    ADD COLUMN `meta_title` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `seo_settings` (
    `id` VARCHAR(191) NOT NULL,
    `page_type` ENUM('HOME', 'PROPERTY_LISTING', 'PROPERTY', 'CONTACT', 'ABOUT', 'PRIVACY_POLICY', 'TERMS', 'FAQ') NOT NULL,
    `entity_id` VARCHAR(191) NULL,
    `meta_title` VARCHAR(191) NULL,
    `meta_description` TEXT NULL,
    `meta_keywords` TEXT NULL,
    `og_title` VARCHAR(191) NULL,
    `og_description` TEXT NULL,
    `og_image` TEXT NULL,
    `canonical_url` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `seo_settings_page_type_entity_id_key`(`page_type`, `entity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
