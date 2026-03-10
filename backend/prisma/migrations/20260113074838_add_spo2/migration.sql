-- CreateTable
CREATE TABLE "SpO2Sample" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "perfusion" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpO2Sample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpO2Summary" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "window" TEXT NOT NULL,
    "avg" INTEGER NOT NULL,
    "min" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,
    "drops" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpO2Summary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SpO2Sample_deviceId_createdAt_idx" ON "SpO2Sample"("deviceId", "createdAt");

-- CreateIndex
CREATE INDEX "SpO2Summary_deviceId_createdAt_idx" ON "SpO2Summary"("deviceId", "createdAt");

-- AddForeignKey
ALTER TABLE "SpO2Sample" ADD CONSTRAINT "SpO2Sample_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpO2Summary" ADD CONSTRAINT "SpO2Summary_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
