-- CreateTable
CREATE TABLE "SleepSession" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "totalMinutes" INTEGER NOT NULL,
    "deepMinutes" INTEGER,
    "lightMinutes" INTEGER,
    "remMinutes" INTEGER,
    "awakeMinutes" INTEGER,
    "avgHR" INTEGER,
    "avgSpO2" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SleepSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SleepSession_deviceId_startTime_idx" ON "SleepSession"("deviceId", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "SleepSession_deviceId_startTime_key" ON "SleepSession"("deviceId", "startTime");

-- AddForeignKey
ALTER TABLE "SleepSession" ADD CONSTRAINT "SleepSession_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
