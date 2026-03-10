"use client";

import React from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Tooltip,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  alpha,
  Stack,
  Chip,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useTranslations } from "next-intl";

/* ================= TYPES ================= */


type HourlyPoint = { hour: string; steps: number };
type WeeklyPoint = { day: string; steps: number };

type ChartPoint = HourlyPoint | WeeklyPoint;

interface StepsChartProps {

   minuteData: any[]; 
  hourlyData: HourlyPoint[];
  weeklyData: WeeklyPoint[];
  maxHourly: number;
  maxWeekly: number;
  range: string; // "30m" | "1h" | "8h" | "1d" | "7d"
}

/** Tooltip payload type (no `any`) */
type TooltipPayloadItem = {
  value?: number;
};

type CustomTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: TooltipPayloadItem[];
};

/* ================= TOOLTIP ================= */

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const stepsValue = payload[0]?.value ?? 0;

  const t = useTranslations("stepsChart");

  return (
    <Box
      sx={{
        background: "white",
        p: 1.2,
        borderRadius: 2,
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <Typography
        variant="caption"
        sx={{ fontWeight: 700, color: "text.secondary" }}
      >
        {label}
      </Typography>

      <Typography variant="body2" sx={{ fontWeight: 800, color: "#22c55e" }}>
        {stepsValue} steps
      </Typography>
    </Box>
  );
};

/* ================= COMPONENT ================= */

export default function StepsChart({
   minuteData,
  hourlyData,
  weeklyData,
  maxHourly,
  maxWeekly,
  range,
}: StepsChartProps) {
  const t = useTranslations("stepsChart");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isMinute = range === "30m" || range === "1h";

  const isWeekly = range === "7d";

  // data + axis keys
  const chartData = isMinute
  ? minuteData
  : isWeekly
  ? weeklyData
  : hourlyData;

const xKey = isMinute ? "minute" : isWeekly ? "day" : "hour";

const maxY = isWeekly
  ? maxWeekly
  : Math.max(10, ...chartData.map((d: any) => d.steps || 0));
  // stats
  const totalSteps = chartData.reduce(
    (sum, item) => sum + (Number(item.steps) || 0),
    0
  );
  const avgSteps = chartData.length
    ? Math.round(totalSteps / chartData.length)
    : 0;

  // find peak item safely (no any)
  const peakItem =
  chartData.length > 0
    ? chartData.reduce((max: any, item: any) =>
        item.steps > max.steps ? item : max
      )
    : null;

const peakLabel =
  peakItem?.minute || peakItem?.hour || peakItem?.day || null;

  // X-axis label formatting
  const formatXAxis = (value: string) => {
  if (isWeekly) return value;
  if (isMinute) return value; // show full time (10:49)
  return value.split(":")[0]; // show hour only
};

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        background: theme.palette.background.paper,
        height: "100%",
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
             {isWeekly
  ? t("weeklyTitle")
  : isMinute
  ? t("minuteTitle")
  : t("hourlyTitle")}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", gap: 0.6 }}
            >
              <AccessTimeIcon sx={{ fontSize: 14 }} />
             {isWeekly
  ? t("weeklySubtitle")
  : isMinute
  ? t("minuteSubtitle")
  : t("hourlySubtitle")}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip
              size="small"
              label={t("avg", {
  value: avgSteps,
  unit: isWeekly ? t("day") : t("hour")
})}
              color="primary"
              variant="outlined"
            />

            {peakItem && peakLabel && (
              <Chip
                size="small"
                label={`Peak: ${peakLabel} (${peakItem.steps})`}
                color="success"
                variant="outlined"
              />
            )}
          </Stack>
        </Stack>

        {/* Chart */}
        <Box sx={{ width: "100%", height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              key={range}
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 10 }}
              barCategoryGap={0}
              barGap={0}
            >
              <CartesianGrid
                stroke={alpha(theme.palette.divider, 0.15)}
                strokeDasharray="3 3"
                vertical={false}
              />

              {/* ✅ FIXED: use xKey instead of hour */}
              <XAxis
                dataKey={xKey}
                tickFormatter={formatXAxis}
                stroke={alpha(theme.palette.text.secondary, 0.8)}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />

              <YAxis hide domain={[0, Math.ceil(maxY * 1.15)]} />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
              />

              <defs>
                <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={1} />
                </linearGradient>
              </defs>

              <Bar
                dataKey="steps"
                fill="url(#stepsGradient)"
                radius={[14, 14, 0, 0]}
                barSize={isWeekly ? 34 : 18}
                isAnimationActive={true}
                animationDuration={500}
                animationEasing="ease-in-out"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill="url(#stepsGradient)"
                    stroke="transparent"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Footer */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
          sx={{
            mt: 2,
            pt: 1.5,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          }}
        >
          <Typography variant="caption" color="text.secondary">
           {isWeekly
  ? `Max: ${maxWeekly} steps/day`
  : isMinute
  ? `Max: ${maxY} steps/min`
  : `Max: ${maxHourly} steps/hr`}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <TrendingUpIcon sx={{ fontSize: 12 }} />
            Total: {totalSteps} steps
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
