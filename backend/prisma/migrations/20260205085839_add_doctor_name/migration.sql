/*
  Warnings:

  - Made the column `doctorName` on table `UserDoctorAccess` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserDoctorAccess" ALTER COLUMN "doctorName" SET NOT NULL;
