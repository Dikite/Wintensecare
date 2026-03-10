/*
  Warnings:

  - You are about to drop the column `doctorId` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the `Consent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DoctorProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Consent" DROP CONSTRAINT "Consent_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Consent" DROP CONSTRAINT "Consent_userId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorProfile" DROP CONSTRAINT "DoctorProfile_userId_fkey";

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "doctorId";

-- DropTable
DROP TABLE "Consent";

-- DropTable
DROP TABLE "DoctorProfile";
