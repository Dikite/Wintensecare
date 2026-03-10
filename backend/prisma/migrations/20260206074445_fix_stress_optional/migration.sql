-- DropIndex
DROP INDEX "Stress_deviceId_createdAt_idx";

-- AlterTable
ALTER TABLE "Stress" ADD COLUMN     "source" TEXT,
ALTER COLUMN "level" DROP NOT NULL;
