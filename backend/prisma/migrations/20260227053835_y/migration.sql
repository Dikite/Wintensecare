/*
  Warnings:

  - Made the column `measuredAt` on table `Stress` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Stress" ALTER COLUMN "measuredAt" SET NOT NULL;
