"use client";
 
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useTranslations } from "next-intl";
import { MuiMetricCard } from "../../../components/MuiMetricCard";
import { WorkoutSession } from "@/types/exercise";
import {
  Grid,
  Stack,
  Typography,
  Chip,
  Box,
  useTheme,
  alpha,
} from "@mui/material";
 
/* =========================
   BUILD TODAY 00-23 DATA
========================= */
function buildTodayData(history: WorkoutSession[]) {
  const today = new Date().toISOString().slice(0, 10);
  const t = useTranslations("todayProgress");
 
  return Array.from({ length: 24 }, (_, hour) => {
    const sessions = history.filter((w) => {
      if (!w.startTime.startsWith(today)) return false;
      return new Date(w.startTime).getHours() === hour;
    });
 
    const breakdown: Record<string, number> = {};
    let totalMinutes = 0;
 
    sessions.forEach((w) => {
      const mins = Math.round((w.duration || 0) / 60);
      totalMinutes += mins;
 
      breakdown[w.type] =
        (breakdown[w.type] || 0) + mins;
    });
 
    return {
      hour: `${hour.toString().padStart(2, "0")}:00`,
      range: `${hour
        .toString()
        .padStart(2, "0")}:00 - ${(
        hour + 1
      )
        .toString()
        .padStart(2, "0")}:00`,
      minutes: totalMinutes,
      breakdown,
    };
  });
}
/* =========================
   TODAY SUMMARY
========================= */
function buildTodaySummary(history: WorkoutSession[]) {
  const t = useTranslations("todayProgress");
  const today = new Date().toISOString().slice(0, 10);
  const map: Record<string, number> = {};
 
  history.forEach((w) => {
    if (!w.startTime.startsWith(today)) return;
    const mins = Math.round((w.duration || 0) / 60);
    map[w.type] = (map[w.type] || 0) + mins;
  });
 
  return Object.entries(map).map(([type, minutes]) => ({
    type,
    minutes,
  }));
}
 
/* =========================
   CUSTOM TOOLTIP
========================= */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const t = useTranslations("todayProgress");
 
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        backgroundColor: "#111",
        color: "#fff",
        fontSize: 12,
      }}
    >
      <Typography fontWeight={600}>{label}</Typography>
      <Typography>
       {payload[0].value} {t("minutesActive")}
      </Typography>
    </Box>
  );
};
 
/* =========================
   COMPONENT
========================= */
export default function TodayProgressChart({
 
  history,
}: {
  history: WorkoutSession[];
}) {
  const theme = useTheme();
  const chartData = buildTodayData(history);
  const summary = buildTodaySummary(history);
  const t = useTranslations("todayProgress");
 
  return (
    <MuiMetricCard
   title={t("title")}
      sx={{ minHeight: 360 }}
    >
      <Grid container spacing={3}>
        {/* LEFT → ACTIVITY CHART */}
        <Grid item xs={12} md={8}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart key={chartData.reduce((sum, d) => sum + d.minutes, 0)}
  data={chartData}>
              <defs>
                <linearGradient
                  id="activityGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={theme.palette.success.main}
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="95%"
                    stopColor={alpha(
                      theme.palette.success.main,
                      0.4
                    )}
                    stopOpacity={0.3}
                  />
                </linearGradient>
              </defs>
 
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                opacity={0.2}
              />
 
              <XAxis
                dataKey="hour"
                interval={2}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
 
              <YAxis hide />
 
             <Tooltip
  cursor={{ fill: alpha(theme.palette.primary.main, 0.05) }}
  content={({ active, payload }) => {
    if (!active || !payload?.length) return null;
 
    const p = payload[0].payload;
 
    return (
      <Box
        sx={{
          p: 1.5,
          borderRadius: 3,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          minWidth: 200,
        }}
      >
        <Typography fontWeight={700} mb={0.5}>
          {p.range}
        </Typography>
 
        {Object.keys(p.breakdown).length === 0 ? (
          <Typography fontSize={12} color="text.secondary">
          {t("noActivity")}
          </Typography>
        ) : (
          <>
            {Object.entries(p.breakdown).map(
              ([type, mins]: any) => (
                <Typography
                  key={type}
                  fontSize={12}
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{type.toUpperCase()}</span>
                  <b>{mins} min</b>
                </Typography>
              )
            )}
 
            <Box
              sx={{
                height: 1,
                bgcolor: theme.palette.divider,
                my: 1,
              }}
            />
 
            <Typography
              fontSize={12}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>{t("total")}</span>
              <b>{p.minutes} min</b>
            </Typography>
          </>
        )}
      </Box>
    );
  }}
/>
 
             <Bar
  dataKey="minutes"
  fill="url(#activityGradient)"
  radius={[10, 10, 0, 0]}
  barSize={20}
  isAnimationActive
  animationDuration={1500}
  animationEasing="ease-in-out"
/>
            </BarChart>
          </ResponsiveContainer>
        </Grid>
 
        {/* RIGHT → TODAY BREAKDOWN */}
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Typography fontWeight={700}>
             {t("breakdownTitle")}
            </Typography>
 
            {summary.length === 0 && (
              <Typography
                fontSize={13}
                color="text.secondary"
              >
              {t("noWorkout")}
              </Typography>
            )}
 
            {summary.map((s) => (
              <Stack
                key={s.type}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  p: 1,
                  borderRadius: 2,
                  backgroundColor: alpha(
                    theme.palette.primary.main,
                    0.06
                  ),
                }}
              >
                <Chip
                  label={s.type.toUpperCase()}
                  size="small"
                  sx={{
                    fontWeight: 600,
                  }}
                />
 
                <Typography fontWeight={700}>
                  {s.minutes} min
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </MuiMetricCard>
  );
}
 