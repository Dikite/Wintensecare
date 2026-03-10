/*
  Warnings:

  - You are about to drop the column `bpAt` on the `DeviceVitalsSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `heartRateAt` on the `DeviceVitalsSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `spo2At` on the `DeviceVitalsSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `stressAt` on the `DeviceVitalsSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `temperatureAt` on the `DeviceVitalsSnapshot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DeviceVitalsSnapshot" DROP COLUMN "bpAt",
DROP COLUMN "heartRateAt",
DROP COLUMN "spo2At",
DROP COLUMN "stressAt",
DROP COLUMN "temperatureAt",
ADD COLUMN     "measuredAt" TIMESTAMP(3);
