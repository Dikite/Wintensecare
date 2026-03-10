"use client";
 
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Box, Typography, useTheme, alpha  } from "@mui/material";
import type { TemperaturePoint, TemperatureRange } from "@/types/temperature";
import { getTemperatureStatus } from "@/lib/utils/temperatureUtils";
import { useTranslations } from "next-intl";
 
/* ================= TOOLTIP ================= */
 
const TemperatureTooltip = ({
  active,
  payload,
  rangeTemp,
}: any) => {
 const t = useTranslations("temperature");
 
  if (!active || !payload?.length) return null;
 
  const p = payload[0].payload;
  if (p?.value == null) return null;
 
  let title = "";
 
  if (rangeTemp === "30m" || rangeTemp === "1h") {
    // exact measurement time
    title = new Date(p.ts).toLocaleString("en-GB");
  }
 else if (rangeTemp === "8h" || rangeTemp === "1d") {
  const date = new Date(p.ts).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
 
title = `${date} • ${formatHourRange(p.ts)}`;
}
  else if (rangeTemp === "1w") {
    // daily
    title = new Date(p.ts).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
 
  return (
    <Box
      sx={{
        p: 1.2,
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        minWidth: 200,
      }}
    >
  <Typography fontWeight={700} sx={{ whiteSpace: "pre-line" }}>
  {title}
</Typography>
 
      <Typography fontSize={12}>
       {t("temperature")} <b>{p.value.toFixed(1)} °C</b>
      </Typography>
 
      {rangeTemp === "1w" && (
        <Typography fontSize={12}>
         {t("status")} <b>{getTemperatureStatus(p.value)}</b>
        </Typography>
      )}
    </Box>
  );
};
 
function buildFixedWeeklyPoints(points: TemperaturePoint[]) {
  const map = new Map<number, number>();
 
  points.forEach(p => {
    const d = new Date(p.ts);
    d.setHours(0, 0, 0, 0);
    map.set(d.getTime(), p.value);
  });
 
  const today = new Date();
  today.setHours(0, 0, 0, 0);
 
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
 
    const ts = d.getTime();
 
    return {
      ts,
      label: d.toLocaleDateString("en-GB", { weekday: "short" }),
      value: map.get(ts) ?? null, // 👈 missing days allowed
    };
  });
}
 
function formatHourRange(ts: number) {
  const start = new Date(ts);
  const end = new Date(ts);
  end.setHours(start.getHours() + 1);
 
  return `${start.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })} – ${end.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })}`;
}
 
 
 
 
/* ================= COMPONENT ================= */
 
export default function TemperatureChart({
  points = [],
  rangeTemp,
}: {
  points?: TemperaturePoint[];
  rangeTemp: TemperatureRange;
}) {
  const theme = useTheme();
 
 const data = useMemo(() => {
  if (!points || !Array.isArray(points)) return [];
 
  if (rangeTemp === "1w") {
    return buildFixedWeeklyPoints(points);
  }
 
 
 return points.map(p => ({
  ts: p.ts,
  label:
    rangeTemp === "1d"
      ? new Date(p.ts).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          hour12: false,
        })
      : new Date(p.ts).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
  value: p.value,
}));
}, [points, rangeTemp]);
 
 const values = (data ?? [])
  .map(d => d.value)
  .filter((v): v is number => v != null);
 
  const minY = values.length ? Math.floor(Math.min(...values) - 1) : 28;
  const maxY = values.length ? Math.ceil(Math.max(...values) + 1) : 38;
 
  if (rangeTemp === "1w") {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ left: 36, right: 36 }}>
        <CartesianGrid
          vertical={false}
          stroke={alpha(theme.palette.divider, 0.15)}
        />
 
        <XAxis
          dataKey="label"
          type="category"
          allowDuplicatedCategory={false}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
        />
 
        <YAxis
          domain={[minY, maxY]}
          tickFormatter={(v) => `${v} °C`}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
          width={56}
        />
 
       <Tooltip content={<TemperatureTooltip rangeTemp={rangeTemp} />} />
 
        <Bar
          dataKey="value"
          fill={theme.palette.error.main}
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
 
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <CartesianGrid
  vertical={false}
  stroke={alpha(theme.palette.divider, 0.15)}
/>
        <XAxis
  dataKey="label"
  type="category"
  allowDuplicatedCategory={false}
  axisLine={false}
  tickLine={false}
  tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
/>
       <YAxis
  domain={[minY, maxY]}
  tickFormatter={(v) => `${v} °C`}
  axisLine={false}
  tickLine={false}
  tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
  width={60}
/>
       <Tooltip content={<TemperatureTooltip rangeTemp={rangeTemp} />} />
        <Area
          dataKey="value"
          type="monotone"
          stroke={theme.palette.error.main}
          fillOpacity={0.2}
          fill={theme.palette.error.main}
          connectNulls
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
 
 
 
 