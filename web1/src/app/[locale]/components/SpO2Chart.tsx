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
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { useTranslations } from "next-intl";
import type { SpO2Point, SpO2Range } from "@/types/spo2";
import { buildSpO2ChartData } from "@/lib/utils/spo2";
 
type Props = {
  pointsspo2: SpO2Point[];
  loading: boolean;
  range: SpO2Range;
};
 
export default function SpO2Chart({
  pointsspo2,
  loading,
  range,
}: Props) {
  const theme = useTheme();
 
  const data = useMemo(
    () => buildSpO2ChartData(pointsspo2, range),
    [pointsspo2, range]
  );
const t = useTranslations("spo2Chart");
  if (loading) {
    return (
      <Box sx={{ height: 280, display: "grid", placeItems: "center" }}>
        <CircularProgress size={28} />
      </Box>
    );
  }
 
  if (!data.length) {
    return (
      <Box sx={{ height: 280, display: "grid", placeItems: "center", px: 2 }}>
       <Typography fontSize={13} color="text.secondary" align="center">
  {t("collecting")}
  <br />
  {t("wearDevice")}
</Typography>
      </Box>
    );
  }
 
  return (
    <Box sx={{ height: 280, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 20 }}>
          <CartesianGrid
            stroke={alpha(theme.palette.text.primary, 0.08)}
            strokeDasharray="4 4"
            vertical={false}
          />
 
          {/* X AXIS */}
    <XAxis
  dataKey="ts"
  type="number"
  scale="time"
  domain={["dataMin", "dataMax"]}
  tickFormatter={(v) => {
    const d = new Date(v);
 
    if (range === "7d") {
      return d.toLocaleDateString(undefined, { weekday: "short" });
    }
 
   if (range === "1d" || range === "8h") {
  return d.getHours().toString().padStart(2, "0");
}
 
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }}
  tick={{
    fontSize: 11,
    fill: alpha(theme.palette.text.primary, 0.85),
  }}
  stroke={alpha(theme.palette.text.primary, 0.75)}
  minTickGap={20}
/>
 
          {/* Y AXIS */}
          <YAxis
            domain={[68, 102]}
            tick={{
              fontSize: 12,
              fill: alpha(theme.palette.text.primary, 0.85),
            }}
            stroke={alpha(theme.palette.text.primary, 0.75)}
          />
 
          {/* TOOLTIP */}
          <Tooltip
  cursor={false}
  content={({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const raw = payload?.[0]?.payload;
if (!raw) return null;
    if (raw.min == null || raw.max == null) return null;
 
    const ts = new Date(raw.ts);
 
    let headerLabel = "";
 
    if (range === "7d")  {
      // ✅ Date only
      headerLabel = ts.toLocaleDateString(undefined, {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });
    }
 else if (range === "8h") {
 
  const from = new Date(ts);
  from.setMinutes(0,0,0);
 
  const to = new Date(from.getTime() + 60 * 60 * 1000);
 
  headerLabel = `${from.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })} – ${to.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
 
}
else if (range === "1d") {
 
  const from = new Date(ts);
  from.setMinutes(0,0,0);
 
  const to = new Date(from.getTime() + 60 * 60 * 1000);
 
  headerLabel = `${from.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })} – ${to.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}
 
    else {
      // ✅ 30m / 1h → full date + time
      headerLabel = ts.toLocaleString(undefined, {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
      });
    }
 
    const current = raw.value != null ? Number(raw.value) : null;
 
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
          {headerLabel}
        </Typography>
 
        <Box sx={{ mt: 0.6 }}>
          <Typography fontSize={12}>
           {t("current")}  <b>{current !== null ? `${current}%` : "--"}</b>
          </Typography>
 
          <Typography fontSize={12}>
           {t("min")} <b>{raw.min}%</b>
          </Typography>
 
          <Typography fontSize={12}>
             {t("max")} <b>{raw.max}%</b>
          </Typography>
        </Box>
      </Box>
    );
  }}
/>
 
          {/* THRESHOLDS */}
          <ReferenceLine
            y={95}
            stroke={alpha(theme.palette.success.main, 0.9)}
            strokeDasharray="4 4"
          />
          <ReferenceLine
            y={90}
            stroke={alpha(theme.palette.warning.main, 0.9)}
            strokeDasharray="4 4"
          />
 
          {/* SPO2 RODS */}
          <Scatter
  dataKey="value"
  fill={theme.palette.info.main}
  shape="circle"
>
            <ErrorBar
              dataKey="err"
              width={12}
              stroke={alpha(theme.palette.info.main, 0.95)}
              strokeWidth={10}
              strokeLinecap="round"
            />
          </Scatter>
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}
 