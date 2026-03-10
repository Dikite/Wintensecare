-- CreateTable
CREATE TABLE "ECGSummary" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "window" TEXT NOT NULL,
    "avgHR" INTEGER NOT NULL,
    "minHR" INTEGER NOT NULL,
    "maxHR" INTEGER NOT NULL,
    "rrVar" DOUBLE PRECISION NOT NULL,
    "pvcCount" INTEGER NOT NULL,
    "quality" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ECGSummary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ECGSummary" ADD CONSTRAINT "ECGSummary_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
