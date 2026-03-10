"use client";
 
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Box, Typography, alpha, useTheme } from "@mui/material";
import type { SleepRange, SleepSession } from "@/types/sleep";
import { buildFixedSleepBars } from "@/lib/utils/sleepUtils";
import { useTranslations } from "next-intl";
 
 
type Props = {
  sessions: SleepSession[];
  rangeSleep: SleepRange;
};
 
function minsToHrs(mins: number) {
  return Math.round((mins / 60) * 10) / 10;
}
 
export default function SleepChart({ sessions, rangeSleep }: Props) {
  const theme = useTheme();
const t = useTranslations("sleep");
 
  const data = useMemo(() => {
    const fixed = buildFixedSleepBars(sessions, rangeSleep);
 
    return fixed.map((d) => ({
      label: d.label,
      deep: minsToHrs(d.deep),
      light: minsToHrs(d.light),
      rem: minsToHrs(d.rem),
      awake: minsToHrs(d.awake),
      total: minsToHrs(d.total),
      startTime: d.startTime,
      endTime: d.endTime,
      key: d.key,
    }));
  }, [sessions, rangeSleep]);
 
  // ✅ for 1m we show 30 bars → make chart scrollable
  const isMonth = rangeSleep === "1m";
  const chartWidth = isMonth ? Math.max(900, data.length * 40) : "100%";
 
  // ✅ show less x labels for 1m (every 4th day)
 const tickGap = rangeSleep === "1m" ? 2 : rangeSleep === "2w" ? 2 : 1;
 
const showTick = (index: number) => {
  return index % tickGap === 0;
};
 
 
  return (
    <Box sx={{ width: "100%", height: 260, overflowX: isMonth ? "auto" : "hidden" }}>
      <Box sx={{ width: chartWidth, height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap={isMonth ? 6 : 14}>
            <CartesianGrid
              stroke={alpha(theme.palette.divider, 0.15)}
              strokeDasharray="3 3"
              vertical={false}
            />
 
           <XAxis
  dataKey="label"
  tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
  axisLine={false}
  tickLine={false}
  interval={0}
  tickFormatter={(value, index) => (showTick(index) ? value : "")}
/>
 
            <YAxis
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              axisLine={false}
              tickLine={false}
              width={42}
              tickFormatter={(v) => `${v}h`}
              domain={[0, 12]}
            />
 
            <Tooltip
              cursor={{ fill: alpha(theme.palette.primary.main, 0.08) }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0].payload as any;
 
                return (
                  <Box
                    sx={{
                      p: 1.2,
                      borderRadius: 2,
                      bgcolor: "white",
                      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                      minWidth: 220,
                    }}
                  >
                    <Typography fontSize={12} color="text.secondary">
                      {p.key}
                    </Typography>
 
                    {p.startTime && p.endTime ? (
                      <Typography fontSize={12} color="text.secondary">
                        {new Date(p.startTime).toLocaleString()} →{" "}
                        {new Date(p.endTime).toLocaleString()}
                      </Typography>
                    ) : (
                      <Typography fontSize={12} color="text.secondary">
                       { t("noData")}
                      </Typography>
                    )}
 
                    <Typography fontSize={14} fontWeight={800} sx={{ mt: 0.5 }}>
                      Total: {p.total}h
                    </Typography>
 
                    <Typography fontSize={12}>Deep: {p.deep}h</Typography>
                    <Typography fontSize={12}>Light: {p.light}h</Typography>
                    <Typography fontSize={12}>REM: {p.rem}h</Typography>
                    <Typography fontSize={12}>Awake: {p.awake}h</Typography>
                  </Box>
                );
              }}
            />
 
            {/* ✅ stacked bars */}
            <Bar
              dataKey="deep"
              stackId="a"
              fill="#6d28d9"
              radius={[8, 8, 0, 0]}
              barSize={isMonth ? 18 : 26}
            />
            <Bar dataKey="light" stackId="a" fill="#a855f7" />
            <Bar dataKey="rem" stackId="a" fill="#60a5fa" />
            <Bar dataKey="awake" stackId="a" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
 
 