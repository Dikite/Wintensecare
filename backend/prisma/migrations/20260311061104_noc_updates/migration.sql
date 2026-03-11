/*
  Warnings:

  - You are about to drop the column `acknowledgedAt` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `acknowledgedBy` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `lastTriggeredAt` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `occurrenceCount` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `lastSeen` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Device` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `DeviceControl` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OperatorAuditLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DeviceControl" DROP CONSTRAINT "DeviceControl_deviceId_fkey";

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "acknowledgedAt",
DROP COLUMN "acknowledgedBy",
DROP COLUMN "lastTriggeredAt",
DROP COLUMN "occurrenceCount",
DROP COLUMN "state",
ADD COLUMN     "acknowledged" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "lastSeen",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- DropTable
DROP TABLE "DeviceControl";

-- DropTable
DROP TABLE "OperatorAuditLog";

-- DropEnum
DROP TYPE "UserRole";
