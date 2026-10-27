-- CreateIndex
CREATE INDEX `projects_status_idx` ON `projects`(`status`);

-- CreateIndex
CREATE INDEX `projects_is_featured_idx` ON `projects`(`is_featured`);

-- CreateIndex
CREATE INDEX `projects_display_order_idx` ON `projects`(`display_order`);

-- CreateIndex
CREATE INDEX `projects_deleted_at_idx` ON `projects`(`deleted_at`);
