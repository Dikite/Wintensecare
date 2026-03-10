/*
  Warnings:

  - You are about to drop the column `duration` on the `ECG` table. All the data in the column will be lost.
  - You are about to drop the column `samples` on the `ECG` table. All the data in the column will be lost.
  - Added the required column `durationMs` to the `ECG` table without a default value. This is not possible if the table is not empty.
  - Added the required column `samplingRate` to the `ECG` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ECG_deviceId_createdAt_idx";

-- AlterTable
ALTER TABLE "ECG" DROP COLUMN "duration",
DROP COLUMN "samples",
ADD COLUMN     "durationMs" INTEGER NOT NULL,
ADD COLUMN     "samplingRate" INTEGER NOT NULL,
ADD COLUMN     "signal" DOUBLE PRECISION[];
