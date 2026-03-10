"use client";

import { useEffect, useState } from "react";
import Protected from "@/lib/api/protected";
import { api } from "@/lib/api/api";
import { Box, Typography, Button, Stack, Chip } from "@mui/material";
import { useRouter } from "@/navigation";
import { Activity } from "lucide-react";
import { useTranslations } from "next-intl";

import { useDashboard } from "@/hooks/useDashboard";
import { useDeviceDashboard } from "@/hooks/useDeviceDashboard";

type ECGSession = {
  id: string;
  samplingRate: number;
  durationMs: number;
  createdAt: string;
  measuredAt: string;
};

export default function ECGPage() {

  const [data, setData] = useState<ECGSession[]>([]);
  const router = useRouter();
  const t = useTranslations("ecgSessions");

  const { device } = useDashboard();
  const dashboardMetrics = useDeviceDashboard(device?.id);

  const [activeDeviceId, setActiveDeviceId] = useState<string>();

  const availableDevices =
    dashboardMetrics?.metrics?.ecg?.availableOn ?? [];

  /* Default device */
  useEffect(() => {
    if (!device?.id) return;
    setActiveDeviceId(prev => prev ?? device.id);
  }, [device?.id]);

  /* Fetch ECG sessions */
  useEffect(() => {
    if (!activeDeviceId) return;

    api<ECGSession[]>(`/vitals/ecg?deviceId=${activeDeviceId}`)
      .then(setData)
      .catch(console.error);

  }, [activeDeviceId]);

  return (
    <Protected>

      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#ffffff",
          p: 2,
        }}
      >

        {/* HEADER */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Activity size={18} color="#0ea5e9" />
          <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
            {t("title")}
          </Typography>
        </Stack>

        {/* DEVICE SWITCH */}
        <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">

          <Chip
            label={device?.name ?? "Current Device"}
            color={activeDeviceId === device?.id ? "primary" : "default"}
            variant={activeDeviceId === device?.id ? "filled" : "outlined"}
            onClick={() => setActiveDeviceId(device?.id)}
            size="small"
          />

          {availableDevices.map((d: any) => (
            <Chip
              key={d.id}
              label={d.name}
              color={activeDeviceId === d.id ? "primary" : "default"}
              variant={activeDeviceId === d.id ? "filled" : "outlined"}
              onClick={() => setActiveDeviceId(d.id)}
              size="small"
            />
          ))}

        </Stack>

        {/* ECG SESSIONS */}
        <Stack spacing={2} mt={2}>

          {data.map((ecg) => (

            <Box
              key={ecg.id}
              sx={{
                p: 2.5,
                borderRadius: 2,
                bgcolor: "#f9fafb",
                border: "1px solid #e5e7eb",
              }}
            >

              <Typography fontWeight={600} fontSize={15}>
                {new Date(ecg.measuredAt).toLocaleString()}
              </Typography>

              <Typography fontSize={13} color="#6b7280">
                {t("duration")}: {ecg.durationMs} ms
              </Typography>

              <Typography fontSize={13} color="#6b7280">
                {t("samplingRate")}: {ecg.samplingRate} Hz
              </Typography>

              <Button
                size="small"
                sx={{ mt: 1 }}
                variant="contained"
                onClick={() => {
                  sessionStorage.setItem(
                    `ecg-${ecg.id}`,
                    JSON.stringify(ecg)
                  );
                  router.push(`/dashboard/ecg/${ecg.id}`);
                }}
              >
                {t("viewWaveform")}
              </Button>

            </Box>

          ))}

        </Stack>

      </Box>

    </Protected>
  );
}