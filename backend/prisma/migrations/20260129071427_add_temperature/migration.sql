-- CreateTable
CREATE TABLE "TemperatureSample" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'C',
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemperatureSample_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TemperatureSample_deviceId_measuredAt_idx" ON "TemperatureSample"("deviceId", "measuredAt");

-- AddForeignKey
ALTER TABLE "TemperatureSample" ADD CONSTRAINT "TemperatureSample_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
