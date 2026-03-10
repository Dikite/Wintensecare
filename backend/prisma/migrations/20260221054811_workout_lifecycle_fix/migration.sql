-- AlterTable
ALTER TABLE "WorkoutSession" ADD COLUMN     "autoEnded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "endReason" TEXT,
ADD COLUMN     "lastTelemetryAt" TIMESTAMP(3);
