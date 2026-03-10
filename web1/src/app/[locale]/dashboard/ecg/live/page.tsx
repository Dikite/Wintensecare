"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Protected from "@/lib/api/protected";
import { api } from "@/lib/api/api";
import { Box, Typography, Stack, Paper } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { Activity, HeartPulse } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDashboard } from "@/hooks/useDashboard";


/* ================= TYPES ================= */

type ECGSession = {
  id: string;
  signal: number[];
  samplingRate: number;
  durationMs: number;
  createdAt: string;
};

type Point = {
  t: number; // seconds
  v: number; // mV
};

/* ================= CONFIG ================= */

const WINDOW_SECONDS = 8;          // visible ECG window
const POLL_INTERVAL = 3000;        // backend ECG arrival
const VOLTAGE_RANGE: [number, number] = [-2, 2];

/* ================= PAGE ================= */

export default function LiveECGMonitor() {

  const { device } = useDashboard();

  const [points, setPoints] = useState<Point[]>([]);
  const lastSessionId = useRef<string | null>(null);
  const timeCursor = useRef(0);

  useEffect(() => {
    if (!device?.id) return;

    async function poll() {
      try {
        const sessions = await api<ECGSession[]>(
          `/vitals/ecg?deviceId=${device.id}`
        );

        const latest = sessions.at(-1);
        if (!latest || latest.id === lastSessionId.current) return;

        lastSessionId.current = latest.id;

        const newPoints: Point[] = latest.signal.map((v, i) => ({
          t: timeCursor.current + i / latest.samplingRate,
          v,
        }));

        timeCursor.current = newPoints[newPoints.length - 1].t;

        setPoints((prev) => [...prev, ...newPoints]);
      } catch (e) {
        console.error("ECG polling failed", e);
      }
    }

    poll();
    const timer = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(timer);

  }, [device?.id]);
}

/* ================= COMPONENT ================= */

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Paper
      sx={{
        px: 2,
        py: 1.5,
        bgcolor: "#0b2a4a",
        border: "1px solid #1e3a5f",
        borderRadius: 2,
        minWidth: 140,
      }}
    >
      <Typography fontSize={12} color="#94a3b8">
        {label}
      </Typography>
      <Typography
        fontSize={18}
        fontWeight={600}
        color="#4ade80"
      >
        {value}
      </Typography>
    </Paper>
  );
}
