"use client";
 
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useTranslations } from "next-intl";
import { Box, Typography, alpha, useTheme } from "@mui/material";
import type { StressPoint, StressRange } from "@/types/stress";
 
 
export default function StressChart({
  points,
  range,
  onHoverValue,
}: {
  points: StressPoint[];
  range: StressRange;
  onHoverValue: (v: number | null) => void;
})
 {
  const theme = useTheme();
 
  /* ================= BUILD TIME-SERIES DATA ================= */
 
const data = points;
 const t = useTranslations("stressChart");
  return (
    <Box sx={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <LineChart data={data}
        margin={{
    top: 10,
    right: 24,   // ✅ IMPORTANT
    left: 8,
    bottom: 8,
  }}
        >
          <CartesianGrid
            vertical={false}
            stroke={alpha("#000", 0.08)}
          />
 
<XAxis
  dataKey="label"
  axisLine={{ stroke: "#0f2744" }}
  tickLine={{ stroke: "#0f2744" }}
  tick={{
    fontSize: 12,
    fill: "#151618", // dark gray (VISIBLE)
  }}
/>
 
<YAxis
  domain={[0, 100]}
  ticks={[0, 20, 40, 60, 80, 100]}
  axisLine={{ stroke: "#0f2744" }}
  tickLine={{ stroke: "#0f2744" }}
  tick={{
    fontSize: 12,
    fill: "#151516", // dark gray (VISIBLE)
  }}
/>
 
 
<Tooltip
  cursor={false}
  content={({ active, payload }) => {
    if (!active || !payload?.length) {
      onHoverValue(null);
      return null;
    }
 
    const p = payload[0].payload as StressPoint;
    onHoverValue(p.value ?? null);
 
    // ---------- STATUS ----------
   let statusKey = "noData";

if (p.value != null) {
  if (p.value < 30) statusKey = "relax";
  else if (p.value < 60) statusKey = "normal";
  else if (p.value < 80) statusKey = "moderate";
  else statusKey = "high";
}
 
    // ---------- TIME LABELS ----------
    const start = new Date(p.ts);
 
    let title = "";
 
    // 🕒 8h / 1d → hour range (15:00–16:00)
    if (range === "8h" || range === "1d") {
      const end = new Date(start);
      end.setHours(start.getHours() + 1);
 
      title = `${start.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })} – ${end.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}`;
    }
 
    // 📅 1w → day + date
    else if (range === "1w") {
      title = start.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });
    }
 
    // ⏱ 30m / 1h → exact timestamp
    else {
      title = start.toLocaleString("en-GB");
    }
 
    return (
      <Box
        sx={{
          p: 1.2,
          borderRadius: 2,
          bgcolor: "background.paper",
          boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
          minWidth: 160,
        }}
      >
        <Typography fontWeight={800} fontSize={13}>
          {title}
        </Typography>
 
      {range === "1w" ? (
  <Typography fontWeight={700} sx={{ mt: 0.5 }}>
    {t(statusKey)}
  </Typography>
) : (
  <Typography fontSize={12} sx={{ mt: 0.5 }}>
    {t("avgStress")}: <b>{p.value ?? "--"}</b>
  </Typography>
)}
      </Box>
    );
  }}
/>
          {/* STRESS TREND LINE + MARKERS */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#E5E7EB"          // soft white line
            strokeWidth={2.4}
            connectNulls
            dot={({ cx, cy, payload }) => {
              if (payload.value == null || cx == null || cy == null)
                return null;
 
              return (
                <g>
                  {/* glow */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={9}
                    fill="rgba(10, 159, 179, 0.35)"
                  />
 
                  {/* main dot */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill="#67E8F9"
                    stroke="#ECFEFF"
                    strokeWidth={2}
                  />
                </g>
              );
            }}
            activeDot={{
              r: 7,
              fill: "#67E8F9",
              stroke: "#ECFEFF",
              strokeWidth: 3,
            }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
 
 