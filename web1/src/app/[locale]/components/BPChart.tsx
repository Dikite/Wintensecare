"use client";
 
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Scatter,
  Customized,
  ReferenceLine
} from "recharts";
import { Box, Typography, useTheme, alpha } from "@mui/material";
import type { BPPoint, BPRange } from "@/types/bp";
import { buildFixedBPPoints } from "@/lib/utils/bpRange";
 
 
/* ================= TOOLTIP ================= */
 
const BPTooltip = ({ active, payload, range }: any) => {
  if (!active || !payload?.length) return null;
 
  const p = payload[0].payload;
  if (typeof p?.systolic !== "number") return null;
 
  let header = "";
 
  /* ===== HEADER LOGIC ===== */
  if (range === "30m" || range === "1h") {
    // exact measured time
    header = new Date(p.measuredAt ?? p.ts).toLocaleString("en-GB");
 
  } else if (range === "1d") {
    // hour window (e.g. 13:00 – 14:00)
    const start = new Date(p.ts);
    const end = new Date(p.ts + 60 * 60 * 1000);
 
    header = `${start.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })} – ${end.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
 
  } else {
    // 1w / 1m → date only
    header = new Date(p.ts).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
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
        minWidth: 220,
      }}
    >
      <Typography fontWeight={700}>{header}</Typography>
 
      <Typography fontSize={12}>
        Systolic: <b>{p.systolic}</b> mmHg
      </Typography>
 
      <Typography fontSize={12}>
        Diastolic: <b>{p.diastolic}</b> mmHg
      </Typography>
 
      {typeof p.pulse === "number" && (
        <Typography fontSize={12}>
          Pulse: <b>{p.pulse}</b> bpm
        </Typography>
      )}
    </Box>
  );
};
 
/* ================= THICK BP CONNECTOR ================= */
 
const BPConnectors = ({ points, xAxisMap, yAxisMap }: any) => {
  if (!points?.length || !xAxisMap || !yAxisMap) return null;
 
  const xAxis = Object.values(xAxisMap)[0] as any;
  const yAxis = Object.values(yAxisMap)[0] as any;
 
  const band =
    typeof xAxis.bandwidth === "function" ? xAxis.bandwidth() : 0;
 
  return (
    <g opacity={0.85}> {/* 👈 IMPORTANT */}
      {points.map((p: any, i: number) => {
        if (!p.systolic || !p.diastolic) return null;
 
        const baseX = xAxis.scale(p.label);
        if (typeof baseX !== "number") return null;
 
        const x = baseX + band / 2;
        const ySys = yAxis.scale(p.systolic);
        const yDia = yAxis.scale(p.diastolic);
 
        return (
          <line
            key={i}
            x1={x}
            x2={x}
            y1={ySys}
            y2={yDia}
            stroke="#9d9edb"
            strokeWidth={8}          // 🔥 slightly thicker
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};
 
 
 
/* ================= COMPONENT ================= */
 
export default function BPChart({
  points,
  range,
}: {
  points: BPPoint[];
  range: BPRange;
}) {
  const theme = useTheme();
 
  const data = useMemo(
    () => buildFixedBPPoints(points, range),
    [points, range]
  );
 
  const isMonth = range === "1m";
 
  return (
    <Box sx={{ width: "100%", height: 260, overflowX: isMonth ? "auto" : "hidden" }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ left: 36, right: 36 }}
        >
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
            domain={[60, 180]}
            tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
            tickFormatter={(v) => `${v} mmHg`}
            axisLine={false}
            tickLine={false}
            width={56}
          />
 
         <Tooltip content={<BPTooltip range={range} />} />      
             <Legend verticalAlign="top" height={24} />
 
          {/* 🔥 Thick BP range line */}
         {data.map((d, i) => {
  if (!d.systolic || !d.diastolic) return null;
 
  return (
    <ReferenceLine
      key={i}
      segment={[
        { x: d.label, y: d.diastolic },
        { x: d.label, y: d.systolic },
      ]}
      stroke="#CBD5E1"
      strokeWidth={6}
      strokeLinecap="round"
    />
  );
})}
 
 
          {/* 🔵 Diastolic dot */}
          <Scatter
            data={data}
            dataKey="diastolic"
            fill="#2563EB"
            r={6}
          />
 
          {/* 🟣 Systolic dot */}
          <Scatter
            data={data}
            dataKey="systolic"
            fill="#7C3AED"
            r={6}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
 
 