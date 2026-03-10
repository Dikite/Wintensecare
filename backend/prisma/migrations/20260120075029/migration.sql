/*
  Warnings:

  - Added the required column `bucketAt` to the `SpO2Summary` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SpO2Summary_deviceId_createdAt_idx";

-- AlterTable
ALTER TABLE "SpO2Summary" ADD COLUMN     "bucketAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "quality" INTEGER;

-- CreateIndex
CREATE INDEX "SpO2Summary_deviceId_window_bucketAt_idx" ON "SpO2Summary"("deviceId", "window", "bucketAt");
