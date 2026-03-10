-- AddForeignKey
ALTER TABLE "DeviceVitalsSnapshot" ADD CONSTRAINT "DeviceVitalsSnapshot_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
