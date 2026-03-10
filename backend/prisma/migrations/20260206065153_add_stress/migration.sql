-- CreateTable
CREATE TABLE "Stress" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Stress_deviceId_createdAt_idx" ON "Stress"("deviceId", "createdAt");

-- AddForeignKey
ALTER TABLE "Stress" ADD CONSTRAINT "Stress_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
