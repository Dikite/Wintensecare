-- CreateTable
CREATE TABLE "BloodPressure" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "systolic" INTEGER NOT NULL,
    "diastolic" INTEGER NOT NULL,
    "pulse" INTEGER,
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BloodPressure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BloodPressure_deviceId_measuredAt_idx" ON "BloodPressure"("deviceId", "measuredAt");

-- AddForeignKey
ALTER TABLE "BloodPressure" ADD CONSTRAINT "BloodPressure_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
