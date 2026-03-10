"use client";

import { useEffect, useState } from "react";
import Protected from "@/lib/api/protected";
import { api } from "@/lib/api/api";
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack
} from "@mui/material";
import {
  LineChart,
  Line,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useParams } from "next/navigation";
import { Activity } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDashboard } from "@/hooks/useDashboard";
import { useDeviceDashboard } from "@/hooks/useDeviceDashboard";

/* ================= TYPES ================= */

type ECGSession = {
  id: string;
  signal: number[];
  samplingRate: number;
  durationMs: number;
  createdAt: string;
  measuredAt: string;
};

type Point = {
  t: number;
  v: number;
};

/* ================= PAGE ================= */

export default function ECGWaveformPage() {

  const { id } = useParams<{ id: string }>();
  const { device } = useDashboard();
  const dashboardMetrics = useDeviceDashboard(device?.id);

  const t = useTranslations("ecg");

  const [activeDeviceId, setActiveDeviceId] = useState<string>();
  const [fullData, setFullData] = useState<Point[]>([]);
  const [visibleData, setVisibleData] = useState<Point[]>([]);
  const [playing, setPlaying] = useState(false);
  const [meta, setMeta] = useState<ECGSession | null>(null);

  const availableDevices =
    dashboardMetrics?.metrics?.ecg?.availableOn ?? [];

  /* ================= DEFAULT DEVICE ================= */

  useEffect(() => {
    if (!device?.id) return;
    setActiveDeviceId(prev => prev ?? device.id);
  }, [device?.id]);

  /* ================= FETCH ECG ================= */

  useEffect(() => {

    if (!activeDeviceId || !id) return;

    api<ECGSession[]>(`/vitals/ecg?deviceId=${activeDeviceId}`)
      .then((sessions) => {

        const session = sessions.find((s) => s.id === id);
        if (!session) return;

        const points: Point[] = session.signal.map((v, i) => ({
          t: (i * 1000) / session.samplingRate,
          v,
        }));

        setMeta(session);
        setFullData(points);
        setVisibleData([]);
        setPlaying(true);

      })
      .catch((e) => console.error("ECG load failed", e));

  }, [activeDeviceId, id]);

  /* ================= PLAYBACK ================= */

  useEffect(() => {

    if (!playing || fullData.length === 0 || !meta) return;

    let index = 0;
    const intervalMs = 1000 / meta.samplingRate;

    const timer = setInterval(() => {

      index++;
      setVisibleData(fullData.slice(0, index));

      if (index >= fullData.length) {
        clearInterval(timer);
        setPlaying(false);
      }

    }, intervalMs);

    return () => clearInterval(timer);

  }, [playing, fullData, meta]);

  /* ================= UI ================= */

  return (
    <Protected>

      <Box sx={{ minHeight: "100vh", background: "#061a44", p: 3 }}>

        {/* HEADER */}
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <Activity size={20} color="#22d3ee" />
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
              color: "#fff"
            }}
          >
            {t("title")}
          </Typography>
        </Stack>

        {/* DEVICE SWITCH */}
        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">

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

        {meta && (
          <Typography fontSize={12} color="#c7d2fe" mb={1}>
            Sampling: {meta.samplingRate} Hz · Duration: {meta.durationMs} ms · Recorded at{" "}
            {new Date(meta.measuredAt).toLocaleTimeString("en-GB", {
              hour12: false,
            })}
          </Typography>
        )}

        <Typography fontSize={12} color="#a5b4fc" mb={1}>
          {playing ? t("playing") : t("complete")}
        </Typography>

        {/* ECG CHART */}
        <Box
          sx={{
            background: "linear-gradient(180deg,#0b1f4d,#061a44)",
            borderRadius: 3,
            p: 2,
            border: "2px solid #1e3a8a",
          }}
        >

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={visibleData}>

              <CartesianGrid stroke="#1e3a8a" strokeDasharray="1 4" />

              <YAxis
                domain={[-2, 2]}
                tickFormatter={(v) => `${v} mV`}
                stroke="#93c5fd"
              />

              <Line
                type="linear"
                dataKey="v"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />

            </LineChart>
          </ResponsiveContainer>

        </Box>

        {!playing && (
          <Button
            sx={{ mt: 2 }}
            variant="outlined"
            onClick={() => {
              setVisibleData([]);
              setPlaying(true);
            }}
          >
            {t("replay")}
          </Button>
        )}

      </Box>

    </Protected>
  );
}