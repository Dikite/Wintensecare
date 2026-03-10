/*
  Warnings:

  - You are about to drop the `SleepSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpO2` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Temperature` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SleepSession" DROP CONSTRAINT "SleepSession_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "SpO2" DROP CONSTRAINT "SpO2_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "Temperature" DROP CONSTRAINT "Temperature_deviceId_fkey";

-- DropTable
DROP TABLE "SleepSession";

-- DropTable
DROP TABLE "SpO2";

-- DropTable
DROP TABLE "Temperature";

-- CreateTable
CREATE TABLE "SpO2Sample" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "quality" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpO2Sample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpO2Minute" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "avgSpO2" INTEGER NOT NULL,
    "minSpO2" INTEGER NOT NULL,
    "maxSpO2" INTEGER NOT NULL,
    "samples" INTEGER NOT NULL,
    "quality" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpO2Minute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SpO2Sample_deviceId_createdAt_idx" ON "SpO2Sample"("deviceId", "createdAt");

-- CreateIndex
CREATE INDEX "SpO2Minute_deviceId_createdAt_idx" ON "SpO2Minute"("deviceId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SpO2Minute_deviceId_createdAt_key" ON "SpO2Minute"("deviceId", "createdAt");

-- AddForeignKey
ALTER TABLE "SpO2Sample" ADD CONSTRAINT "SpO2Sample_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpO2Minute" ADD CONSTRAINT "SpO2Minute_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
