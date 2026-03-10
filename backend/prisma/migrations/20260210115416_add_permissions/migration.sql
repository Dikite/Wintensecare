/*
  Warnings:

  - You are about to drop the column `allowCloudSync` on the `UserPermission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserPermission" DROP COLUMN "allowCloudSync";
