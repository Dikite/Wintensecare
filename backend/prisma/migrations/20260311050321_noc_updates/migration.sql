/*
  Warnings:

  - You are about to drop the column `acknowledged` on the `Alert` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'DOCTOR', 'ADMIN', 'NOC_OPERATOR');

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "acknowledged",
ADD COLUMN     "acknowledgedAt" TIMESTAMP(3),
ADD COLUMN     "acknowledgedBy" TEXT,
ADD COLUMN     "lastTriggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "occurrenceCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "state" TEXT NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "lastSeen" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ONLINE';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "DeviceControl" (
    "deviceId" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'NORMAL',
    "interval" INTEGER NOT NULL DEFAULT 10,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceControl_pkey" PRIMARY KEY ("deviceId")
);

-- CreateTable
CREATE TABLE "OperatorAuditLog" (
    "id" TEXT NOT NULL,
    "operatorId" TEXT NOT NULL,
    "patientId" TEXT,
    "alertId" TEXT,
    "action" TEXT NOT NULL,
    "previousState" TEXT,
    "newState" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OperatorAuditLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DeviceControl" ADD CONSTRAINT "DeviceControl_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
