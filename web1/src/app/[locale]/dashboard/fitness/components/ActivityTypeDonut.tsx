"use client";

import { Stack, Typography, Box } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { MuiMetricCard } from "../../../components/MuiMetricCard";
import { WorkoutType } from "@/types/exercise";
import { useTranslations } from "next-intl";

type Props = {
  type: WorkoutType;
  doneMinutes: number;
  targetMinutes: number;
  percent: number;
};

export default function ActivityTypeDonut({
  type,
  doneMinutes,
  targetMinutes,
  percent,
}: Props) {
  const data = [
    { name: "done", value: percent },
    { name: "rest", value: 100 - percent },
  ];
const t = useTranslations("activityDonut");
 const motivation =
  percent === 0
    ? t("motivationStart")
    : percent < 50
    ? t("motivationProgress")
    : percent < 90
    ? t("motivationAlmost")
    : t("motivationDone");

      const formatWorkoutType = (type: WorkoutType) => {
  if (type === "hiit") return "HIIT";
  return type.charAt(0).toUpperCase() + type.slice(1);
};

  return (
    <MuiMetricCard
    title={t("weeklyActivity", {
  type: formatWorkoutType(type),
})}
  sx={{ minHeight: 280 }}
    >
      <Stack alignItems="center" spacing={1}>
        {/* ================= PROGRESS TEXT ================= */}
        <Stack direction="row" alignItems="baseline" spacing={0.6}>
          <Typography
            variant="h4"
            fontWeight={600}
          >
            {doneMinutes}
          </Typography>

          <Typography
            fontSize={16}
            fontWeight={400}
            color="text.secondary"
          >
            / {targetMinutes} {t("mins")}
          </Typography>
        </Stack>

        {/* ================= GAUGE ================= */}
        <Box
          sx={{
            width: "100%",
            height: 150,
            position: "relative",
            mt: -1, // 🔑 pulls gauge closer to text
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                startAngle={180}
                endAngle={0}
                cx="50%"
                cy="100%"              // 🔑 correct anchor
                innerRadius={75}
                outerRadius={95}
                dataKey="value"
                stroke="none"
              >
                <Cell fill="#84cc16" />
                <Cell fill="#e5e7eb" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* ================= MOTIVATION ================= */}
        <Typography
          fontSize={13}
          fontWeight={500}
          textAlign="center"
        >
          {motivation}
        </Typography>

        {/* ================= PERCENT ================= */}
        <Typography fontSize={12} color="text.secondary">
         {percent}% {t("completed")}
        </Typography>
      </Stack>
    </MuiMetricCard>
  );
}
