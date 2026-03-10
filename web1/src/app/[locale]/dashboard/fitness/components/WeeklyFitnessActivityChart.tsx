"use client";

import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useTranslations } from "next-intl";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { WorkoutSession } from "@/types/exercise";

/* =========================
   BUILD LAST 7 DAYS DATA
   (TODAY IS LAST)
========================= */
function buildWeeklyData(history: WorkoutSession[]) {
 const t = useTranslations("fitnessWeekly");
  const today = new Date();

  const days: {
    key: string;
    label: string;
    value: number;
    details: WorkoutSession[];
  }[] = [];

  // build last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString(undefined, {
        weekday: "short",
      }),
      value: 0,
      details: [],
    });
  }

  history.forEach((h) => {
    const day = days.find(
      (d) => d.key === h.startTime.slice(0, 10)
    );
    if (!day) return;

    const calories =
      typeof h.calories === "number"
        ? h.calories
        : Math.round(h.duration / 60);

    day.value += calories;
    day.details.push(h);
  });

  return days;
}

/* =========================
   CUSTOM TOOLTIP
========================= */
function CustomTooltip({ active, payload }: any) {
  const t = useTranslations("fitnessWeekly");
  if (!active || !payload?.length) return null;

  const day = payload[0].payload;

  return (
    <Paper sx={{ p: 1.5, borderRadius: 2 }}>
      <Typography fontWeight={700}>
        {day.label}
      </Typography>

      {day.details.length === 0 && (
        <Typography
          fontSize={12}
          color="text.secondary"
        >
          {t("noWorkouts")}
        </Typography>
      )}

      {day.details.map((d: WorkoutSession) => (
        <Typography
          key={d.id}
          fontSize={12}
          color="text.secondary"
        >
          {new Date(d.startTime).toLocaleTimeString()} ·{" "}
          {d.type} · {d.calories ?? "--"} {t("kcal")}
        </Typography>
      ))}
    </Paper>
  );
}

type Props = {
  history: WorkoutSession[];
};

export default function FitnessWeeklyActivity({
  history,
}: Props) {
  const theme = useTheme();

  // ❌ hide chart if no API data
  if (!history || history.length === 0) {
    return null;
  }

  const data = buildWeeklyData(history);

  const t = useTranslations("fitnessWeekly");
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 3,
        border: `1px solid ${alpha(
          theme.palette.divider,
          0.1
        )}`,
        background: theme.palette.background.paper,
        boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
      }}
    >
      {/* ================= HEADER ================= */}
      <Grid
        container
        spacing={2}
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Grid item>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.info.light}, ${theme.palette.info.main})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <MonitorHeartIcon fontSize="small" />
          </Box>
        </Grid>

        <Grid item xs>
          <Stack>
            <Typography fontWeight={700}>
            {t("title")}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {t("subtitle")}
            </Typography>
          </Stack>
        </Grid>
      </Grid>

      {/* ================= CHART ================= */}
      <Box sx={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ left: 36, right: 36 }}
          >
            <CartesianGrid
              vertical={false}
              stroke={alpha(
                theme.palette.divider,
                0.15
              )}
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill:
                  theme.palette.text.secondary,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill:
                  theme.palette.text.secondary,
              }}
              width={56}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                strokeDasharray: "3 3",
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke={
                theme.palette.text.primary
              }
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
