"use client";
 
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ComposedChart,
  Scatter,
  ErrorBar,
  ReferenceLine,
} from "recharts";
import { Box, Typography, useTheme, alpha } from "@mui/material";
import type { GlucosePoint, GlucoseRange } from "@/types/glucose";
import { buildGlucoseRangeBars } from "@/lib/utils/glucoseRange";
 
import { useTranslations } from "next-intl";
 
/* ---------- derived chart point ---------- */
type ChartPoint = {
  ts: number | string;
  measuredAt?: number;
  value: number;          // avg
  err: [number, number];  // min → max
  min: number;
  max: number;
};
 
/* ---------- helper ---------- */
function labelToTimestamp(label: string, range: GlucoseRange) {
  const now = new Date();
 
 
 
  // 🔥 FIX FOR 1 WEEK (ROLLING)
  if (range === "1w") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
 
    const todayIdx = now.getDay();              // 0–6
    const labelIdx = days.indexOf(label);       // 0–6
 
    // rolling difference (negative = past)
    let diff = labelIdx - todayIdx;
    if (diff > 0) diff -= 7;
 
    const d = new Date(now);
    d.setDate(now.getDate() + diff);
    d.setHours(12, 0, 0, 0);
 
    return d.getTime();
  }
 
  // ---------- 1d (hourly) ----------
 // ---------- 1d (today 00–23 fixed) ----------
if (range === "1d") {
  const now = new Date();
 
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
 
  const hour = Number(label);
 
  const d = new Date(todayStart);
  d.setHours(hour, 0, 0, 0);
 
  return d.getTime();
}
 
 
  // ---------- short ranges ----------
  const [h, m] = label.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m ?? 0, 0, 0);
  return d.getTime();
}
 
function formatTooltipTime(
  p: ChartPoint,
  range: GlucoseRange
) {
  // 1 WEEK → show date only
  if (range === "1w" && typeof p.ts === "number") {
    return new Date(p.ts).toLocaleDateString(undefined, {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  }
 
  // 30m / 1h → RAW reading time
  if ((range === "30m" || range === "1h") && typeof p.ts === "number") {
    return new Date(p.measuredAt ?? p.ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
 
  // ✅ 1d → category label hour (00–23)
  if (range === "1d" && typeof p.ts === "string") {
    return `${p.ts}:00 – ${p.ts}:59`;
  }
 
  // 8h → hourly bucket
  if (typeof p.ts === "number") {
    const start = new Date(p.ts);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
 
    return `${start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} – ${end.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }
 
  return "";
}
/* ---------- COMPONENT ---------- */
 
export default function GlucoseChart({
  points,
  range,
}: {
  points: GlucosePoint[];
  range: GlucoseRange;
}) {
  const theme = useTheme();
 
    const t = useTranslations("glucose");
 
  const data: ChartPoint[] = useMemo(() => {
    const bars = buildGlucoseRangeBars(points, range);
 
 return bars.map((b) => {
  const ts =
    range === "1d"
      ? b.label
      : labelToTimestamp(b.label, range);
 
  // 🚫 If no data in this hour → return null values
  if (b.avg == null || b.min == null || b.max == null) {
    return {
      ts,
      measuredAt: b.measuredAt,
      value: null,
      min: null,
      max: null,
      err: undefined,
    } as any;
  }
 
  return {
    ts,
    measuredAt: b.measuredAt,
    value: b.avg,
    min: b.min,
    max: b.max,
    err: [b.avg - b.min, b.max - b.avg] as [number, number],
  };
});
  }, [points, range]);
 
  return (
    <Box sx={{ height: 260, width: "100%" }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 20, right: 16, left: 10, bottom: 20 }}>
          {/* GRID */}
          <CartesianGrid
            vertical={false}
            stroke={alpha(theme.palette.text.primary, 0.08)}
            strokeDasharray="4 4"
          />
 
          {/* X AXIS — ROLLING */}
        <XAxis
  dataKey="ts"
  type={range === "1d" ? "category" : "number"}
  scale={range === "1d" ? undefined : "time"}
  domain={range === "1d" ? undefined : ["auto", "auto"]}
  tickFormatter={(v) => {
    if (range === "1d") return v; // already 00–23
 
    const d = new Date(v);
 
   return range === "1w"
  ? d.toLocaleDateString(undefined, { weekday: "short" })
  : d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }}
  tick={{ fontSize: 11, fill: alpha(theme.palette.text.primary, 0.85) }}
  stroke={alpha(theme.palette.text.primary, 0.75)}
/>
 
          {/* Y AXIS */}
          <YAxis
            domain={[60, 200]}
          padding={{ top: 20, bottom: 20 }}
            tick={{ fontSize: 12, fill: alpha(theme.palette.text.primary, 0.85) }}
            stroke={alpha(theme.palette.text.primary, 0.75)}
          />
 
          {/* TOOLTIP */}
          <Tooltip
            cursor={false}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0].payload as ChartPoint;
 
              return (
                <Box
                  sx={{
                    p: 1.1,
                    borderRadius: 2.5,
                    bgcolor: alpha(theme.palette.background.paper, 0.96),
                    border: "1px solid",
                    borderColor: alpha(theme.palette.divider, 0.9),
                    boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
                    minWidth: 200,
                  }}
                >
                  <Typography fontSize={12} fontWeight={900}>
  {formatTooltipTime(p, range)}
</Typography>
 
                  <Typography fontSize={12}>
                   {t("avg")}: <b>{p.value} mg/dL</b>
                  </Typography>
                  <Typography fontSize={12}>
                  {t("min")}: <b>{p.min}</b>
                  </Typography>
                  <Typography fontSize={12}>
                   {t("max")}: <b>{p.max}</b>
                  </Typography>
                </Box>
              );
            }}
          />
 
          {/* TARGET RANGES */}
          <ReferenceLine
            y={70}
            stroke={alpha(theme.palette.warning.main, 0.9)}
            strokeDasharray="4 4"
          />
          <ReferenceLine
            y={140}
            stroke={alpha(theme.palette.error.main, 0.9)}
            strokeDasharray="4 4"
          />
 
          {/* 🔴 GLUCOSE RODS — VERTICAL */}
          <Scatter dataKey="value" fill="#FB923C">
            <ErrorBar
              dataKey="err"
              width={10}
              stroke="#FB923C"
              strokeWidth={8}
              strokeLinecap="round"
            />
          </Scatter>
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}
 
 