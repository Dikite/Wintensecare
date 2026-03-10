/*
  Warnings:

  - The primary key for the `DeviceVitalsSnapshot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `DeviceVitalsSnapshot` table. All the data in the column will be lost.
  - Made the column `measuredAt` on table `ECG` required. This step will fail if there are existing NULL values in that column.
  - Made the column `measuredAt` on table `ECGSummary` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DeviceVitalsSnapshot" DROP CONSTRAINT "DeviceVitalsSnapshot_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "ECG" ALTER COLUMN "measuredAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "ECGSummary" ALTER COLUMN "measuredAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Stress" ADD COLUMN     "measuredAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "ECG_deviceId_measuredAt_idx" ON "ECG"("deviceId", "measuredAt");

-- CreateIndex
CREATE INDEX "ECGSummary_deviceId_measuredAt_idx" ON "ECGSummary"("deviceId", "measuredAt");

-- CreateIndex
CREATE INDEX "Stress_deviceId_measuredAt_idx" ON "Stress"("deviceId", "measuredAt");
