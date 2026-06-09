-- AlterTable
ALTER TABLE `enquiries` ADD COLUMN `project_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `properties` ADD COLUMN `project_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `projects` (
    `id` VARCHAR(191) NOT NULL,
    `project_name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `address` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `short_description` TEXT NULL,
    `builder_name` VARCHAR(191) NOT NULL,
    `builder_phone` VARCHAR(191) NOT NULL,
    `builder_email` VARCHAR(191) NOT NULL,
    `status` ENUM('ONGOING', 'COMPLETED', 'UPCOMING') NOT NULL DEFAULT 'ONGOING',
    `banner_image` TEXT NULL,
    `main_image` TEXT NULL,
    `brochure_file` TEXT NULL,
    `google_map_iframe` TEXT NULL,
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `display_order` INTEGER NOT NULL DEFAULT 0,
    `category_id` VARCHAR(191) NOT NULL,
    `created_by_id` VARCHAR(191) NOT NULL,
    `city_id` VARCHAR(191) NOT NULL,
    `meta_title` VARCHAR(191) NULL,
    `meta_description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `projects_slug_key`(`slug`),
    INDEX `projects_category_id_idx`(`category_id`),
    INDEX `projects_created_by_id_idx`(`created_by_id`),
    INDEX `projects_city_id_idx`(`city_id`),
    INDEX `projects_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_images` (
    `id` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `public_id` VARCHAR(191) NULL,
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `project_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `project_images_project_id_idx`(`project_id`),
    INDEX `project_images_sort_order_idx`(`sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_amenities` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,

    INDEX `project_amenities_project_id_idx`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_specifications` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,

    INDEX `project_specifications_project_id_idx`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_highlights` (
    `id` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,

    INDEX `project_highlights_project_id_idx`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `enquiries_project_id_idx` ON `enquiries`(`project_id`);

-- CreateIndex
CREATE INDEX `properties_project_id_idx` ON `properties`(`project_id`);

-- AddForeignKey
ALTER TABLE `properties` ADD CONSTRAINT `properties_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enquiries` ADD CONSTRAINT `enquiries_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_images` ADD CONSTRAINT `project_images_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_amenities` ADD CONSTRAINT `project_amenities_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_specifications` ADD CONSTRAINT `project_specifications_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_highlights` ADD CONSTRAINT `project_highlights_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
