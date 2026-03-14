-- DropForeignKey
ALTER TABLE `Package` DROP FOREIGN KEY `Package_locationId_fkey`;

-- AlterTable
ALTER TABLE `Package` MODIFY `locationId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Package` ADD CONSTRAINT `Package_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
