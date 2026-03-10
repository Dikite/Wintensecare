/*
  Warnings:

  - You are about to drop the column `measuredAt` on the `DeviceVitalsSnapshot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DeviceVitalsSnapshot" DROP COLUMN "measuredAt",
ADD COLUMN     "bpAt" TIMESTAMP(3),
ADD COLUMN     "heartRateAt" TIMESTAMP(3),
ADD COLUMN     "spo2At" TIMESTAMP(3),
ADD COLUMN     "stressAt" TIMESTAMP(3),
ADD COLUMN     "temperatureAt" TIMESTAMP(3),
ADD CONSTRAINT "DeviceVitalsSnapshot_pkey" PRIMARY KEY ("deviceId");

-- DropIndex
DROP INDEX "DeviceVitalsSnapshot_deviceId_key";
