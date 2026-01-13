/*
  Warnings:

  - You are about to drop the `SpO2Minute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpO2Sample` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SpO2Minute" DROP CONSTRAINT "SpO2Minute_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "SpO2Sample" DROP CONSTRAINT "SpO2Sample_deviceId_fkey";

-- DropTable
DROP TABLE "SpO2Minute";

-- DropTable
DROP TABLE "SpO2Sample";
