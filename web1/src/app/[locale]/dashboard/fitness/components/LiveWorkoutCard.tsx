"use client";
 
import React from "react";
import {
  Grid,
  Stack,
  Typography,
  Box,
  Button,
  TextField,
} from "@mui/material";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { MuiMetricCard } from "../../../components/MuiMetricCard";
import { useTranslations } from "next-intl";
 
type Props = {
  live: {
    heartRate?: number;
    avgHR?: number;
    calories?: number;
    steps?: number;
    duration?: number;
     
  };
};
 
export default function LiveWorkoutCard({ live }: Props) {
  /* ================= USER GOAL ================= */
const t = useTranslations("liveWorkout");
 
 
 
const [editingCal, setEditingCal] = React.useState(false);
const [editingSteps, setEditingSteps] = React.useState(false);
 
 
 const [calGoal, setCalGoal] = React.useState(() => {
  if (typeof window === "undefined") return 1000;
 
  const saved = localStorage.getItem("liveWorkoutGoals");
  if (!saved) return 1000;
 
  try {
    return JSON.parse(saved).calGoal ?? 1000;
  } catch {
    return 1000;
  }
});
 
const [stepsGoal, setStepsGoal] = React.useState(() => {
  if (typeof window === "undefined") return 8000;
 
  const saved = localStorage.getItem("liveWorkoutGoals");
  if (!saved) return 8000;
 
  try {
    return JSON.parse(saved).stepsGoal ?? 8000;
  } catch {
    return 8000;
  }
});
 
React.useEffect(() => {
  localStorage.setItem(
    "liveWorkoutGoals",
    JSON.stringify({
      calGoal,
      stepsGoal,
    })
  );
}, [calGoal, stepsGoal]);
 
  /* ================= VALUES ================= */
  const steps = typeof live.steps === "number" ? live.steps : 0;
  const heartRate =
    typeof live.heartRate === "number" ? live.heartRate : null;
  const avgHR =
    typeof live.avgHR === "number" ? live.avgHR : null;
 
  const durationMin =
    typeof live.duration === "number"
      ? Math.max(1, Math.round(live.duration / 60))
      : 1;
 
  /* ================= CALORIES ================= */
  const estimatedCalories =
    steps && avgHR
      ? Math.round(steps * 0.04 + avgHR * durationMin * 0.002)
      : 0;
 
  const calories =
    typeof live.calories === "number"
      ? live.calories
      : estimatedCalories;
 
const percent = Math.min(
  Math.round((calories / Math.max(calGoal, 1)) * 100),
  100
);
 
  const gaugeData = [
    { name: "done", value: percent },
    { name: "rest", value: 100 - percent },
  ];
 
 
 
  return (
    <Grid container spacing={3}>
      {/* ================= STEPS ================= */}
      <Grid item xs={12} md={3}>
       <MuiMetricCard title={t("steps")} sx={{ height: 190 }}>
         <Typography variant="h5" fontWeight={800}>
  {steps}/{stepsGoal}
</Typography>
{editingSteps ? (
  <Stack spacing={1} sx={{ width: "100%" }}>
    <TextField
      size="small"
      type="number"
      value={stepsGoal}
      inputProps={{ min: 1 }}
      onChange={(e) => {
        const value = Number(e.target.value);
        if (!isNaN(value)) setStepsGoal(value);
      }}
      fullWidth
    />
    <Button
      size="small"
      variant="contained"
      onClick={() => setEditingSteps(false)}
      fullWidth
    >
      {t("save")}
    </Button>
  </Stack>
) : (
 <Box
  sx={{
    border: "1px solid",
    borderColor: "primary.main",
    borderRadius: 1,
    px: 1.5,
    py: 0.5,
    mt: 1,
    display: "inline-block",
    cursor: "pointer",
  }}
  onClick={() => setEditingSteps(true)}
>
  <Typography
    fontSize={12}
    fontWeight={600}
    color="primary.main"
  >
    Set Steps Goal
  </Typography>
</Box>
)}
         <Typography fontSize={12} color="text.secondary">
  {t("today")}
</Typography>
        </MuiMetricCard>
      </Grid>
 
      {/* ================= HEART ================= */}
      <Grid item xs={12} md={3}>
      <MuiMetricCard title={t("heartRate")} sx={{ height: 190 }}>
          <Typography variant="h5" fontWeight={800}>
            {heartRate ?? "--"}
            {heartRate && (
              <Typography component="span" fontSize={14} ml={0.5}>
                bpm
              </Typography>
            )}
          </Typography>
          <Typography fontSize={12} color="text.secondary">
         {t("avgHR")}: {avgHR ?? "--"} bpm
          </Typography>
        </MuiMetricCard>
      </Grid>
 
      {/* ================= DAILY GOAL (IMAGE-1 STYLE) ================= */}
      <Grid item xs={12} md={6}>
        <MuiMetricCard title={t("dailyGoal")} sx={{ height: 360 }}>
          <Stack alignItems="center" spacing={1.2}>
            {/* Subtitle */}
            <Typography fontSize={12} color="text.secondary">
             {t("setGoalSubtitle")}
            </Typography>
 
            {/* 🔑 TEXT BLOCK (ABOVE GAUGE) */}
            <Stack alignItems="center" spacing={0.3}>
              <Typography fontSize={12} color="text.secondary">
                Daily Goal
              </Typography>
 
              <Typography fontWeight={800} fontSize={22}>
                {calories}/{calGoal} KCal
              </Typography>
 
              <Typography fontSize={12} color="text.secondary">
              {percent}% {t("completed")}
              </Typography>
            </Stack>
 
            {/* 🔑 GAUGE ONLY */}
            <Box sx={{ width: "100%", height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gaugeData}
                    startAngle={180}
                    endAngle={0}
                    cx="50%"
                    cy="100%"
                    innerRadius={80}
                    outerRadius={95}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#6D28D9" />
                    <Cell fill="#E5E7EB" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Box>
 
            {/* Footer text */}
            <Typography fontSize={12} color="text.secondary">
             {t("goalReached", { percent })}
            </Typography>
 
            {/* SET GOAL */}
     {/* SET GOAL */}
{editingCal ? (
  <Stack direction="row" spacing={1}>
    <TextField
      size="small"
      type="number"
      value={calGoal}
      inputProps={{ min: 1 }}
     onChange={(e) => {
  const value = parseInt(e.target.value, 10);
  if (!isNaN(value)) {
    setCalGoal(value);
  } else {
    setCalGoal(0);
  }
}}
      sx={{ width: 120 }}
    />
    <Button
      size="small"
      variant="contained"
      onClick={() => setEditingCal(false)}
    >
      {t("save")}
    </Button>
  </Stack>
) : (
 <Box
  sx={{
    border: "1px solid",
    borderColor: "primary.main",
    borderRadius: 1,
    px: 1.5,
    py: 0.5,
    mt: 1,
    display: "inline-block",
    cursor: "pointer",
  }}
  onClick={() => setEditingCal(true)}
>
  <Typography
    fontSize={12}
    fontWeight={600}
    color="primary.main"
  >
    Set Calories Goal
  </Typography>
</Box>
)}
          </Stack>
        </MuiMetricCard>
      </Grid>
    </Grid>
  );
}
 
 