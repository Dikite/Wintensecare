"use client";

import { Stack, Typography } from "@mui/material";
import { MuiMetricCard } from "../../../components/MuiMetricCard";
import { WeeklyWorkoutStats } from "@/types/exercise";
import { secondsToMinutes } from "@/lib/utils/exerciseUtils";
import { useTranslations } from "next-intl";

export default function WeeklyStatsCard({
  stats,
}: {
  stats: WeeklyWorkoutStats | null;
}) {
  if (!stats) return null;

  const t = useTranslations("weeklyStats");
  return (
    <MuiMetricCard title={t("title")}>
      <Stack spacing={1}>
        <Typography>{t("workouts")}: {stats.workouts}</Typography>
        <Typography>
         {t("duration")}: {secondsToMinutes(stats.totalDuration)} min
        </Typography>
        <Typography>
         {t("calories")}: {stats.totalCalories} kcal
        </Typography>
        <Typography>{t("avgHR")}: {stats.avgHR} bpm
        </Typography>
      </Stack>
    </MuiMetricCard>
  );
}
