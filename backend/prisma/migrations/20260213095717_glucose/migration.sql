-- AlterTable
ALTER TABLE "GlucoseReading" ADD COLUMN     "mealContext" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "unit" TEXT NOT NULL DEFAULT 'mg/dL';
