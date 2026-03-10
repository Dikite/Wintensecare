/*
  Warnings:

  - A unique constraint covering the columns `[deviceId,window,bucketAt]` on the table `SpO2Summary` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SpO2Summary_deviceId_window_bucketAt_idx";

-- CreateIndex
CREATE UNIQUE INDEX "SpO2Summary_deviceId_window_bucketAt_key" ON "SpO2Summary"("deviceId", "window", "bucketAt");
