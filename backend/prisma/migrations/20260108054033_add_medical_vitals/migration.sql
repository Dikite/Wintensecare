-- CreateTable
CREATE TABLE "SpO2" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpO2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ECG" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "samples" JSONB NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ECG_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Temperature" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Temperature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SleepSession" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "deepSleep" INTEGER NOT NULL,
    "lightSleep" INTEGER NOT NULL,
    "remSleep" INTEGER NOT NULL,
    "awakeTime" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SleepSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SpO2_deviceId_createdAt_idx" ON "SpO2"("deviceId", "createdAt");

-- CreateIndex
CREATE INDEX "ECG_deviceId_createdAt_idx" ON "ECG"("deviceId", "createdAt");

-- CreateIndex
CREATE INDEX "Temperature_deviceId_createdAt_idx" ON "Temperature"("deviceId", "createdAt");

-- CreateIndex
CREATE INDEX "SleepSession_deviceId_startTime_idx" ON "SleepSession"("deviceId", "startTime");

-- AddForeignKey
ALTER TABLE "SpO2" ADD CONSTRAINT "SpO2_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ECG" ADD CONSTRAINT "ECG_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Temperature" ADD CONSTRAINT "Temperature_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SleepSession" ADD CONSTRAINT "SleepSession_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
