-- CreateTable
CREATE TABLE "DeviceVitalsSnapshot" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "heartRate" INTEGER,
    "spo2" INTEGER,
    "systolic" INTEGER,
    "diastolic" INTEGER,
    "temperature" DOUBLE PRECISION,
    "stress" INTEGER,
    "glucose" DOUBLE PRECISION,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceVitalsSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeviceVitalsSnapshot_deviceId_key" ON "DeviceVitalsSnapshot"("deviceId");
