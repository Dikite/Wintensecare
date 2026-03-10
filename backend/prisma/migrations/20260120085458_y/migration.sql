/*
  Warnings:

  - You are about to drop the `SpO2Summary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SpO2Summary" DROP CONSTRAINT "SpO2Summary_deviceId_fkey";

-- DropTable
DROP TABLE "SpO2Summary";
