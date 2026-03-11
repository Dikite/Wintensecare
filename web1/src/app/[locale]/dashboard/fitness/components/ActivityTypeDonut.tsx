"use client";
 
import React from "react";
 
import {  Stack,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Slider,  } from "@mui/material";
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
  setGoals: React.Dispatch<
    React.SetStateAction<Record<WorkoutType, number>>
  >;
};
 
export default function ActivityTypeDonut({
  type,
  doneMinutes,
  targetMinutes,
  percent,
  setGoals,
 
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
 
const [editing, setEditing] = React.useState(false);
 
const [open, setOpen] = React.useState(false);
const [goalValue, setGoalValue] = React.useState(targetMinutes);
 
React.useEffect(() => {
  setGoalValue(targetMinutes);
}, [targetMinutes]);
 
  return (
    <MuiMetricCard
    title={t("Activity", {
  type: formatWorkoutType(type),
})}
  sx={{ minHeight: 340 }}
    >
      <Stack alignItems="center" spacing={1.5}>
        {/* ================= PROGRESS TEXT ================= */}
        <Stack direction="row" alignItems="baseline" spacing={0.6}>
          <Typography
            variant="h4"
            fontWeight={500}
          >
            {doneMinutes}
          </Typography>
 
          <Typography
            fontSize={16}
            fontWeight={200}
            color="text.secondary"
          >
            / {targetMinutes} {t("mins")}
          </Typography>
        </Stack>
 
        {/* ================= GAUGE ================= */}
        <Box
          sx={{
            width: "100%",
            height: 125,
            position: "relative",
            mt: -1, // 🔑 pulls gauge closer to text
              pointerEvents: "none"
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
             <PieChart style={{ pointerEvents: "none" }}>
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
    position: "relative",
    zIndex: 10
  }}
  onClick={() => setOpen(true)}
>
  <Typography
    fontSize={12}
    fontWeight={600}
    color="primary.main"
  >
    Set Goal
  </Typography>
</Box>  
 
      </Stack>
 
<Dialog open={open} onClose={() => setOpen(false)}>
  <DialogTitle>Goal Setting</DialogTitle>
 
  <DialogContent>
    <Stack spacing={3} sx={{ width: 250, mt: 1 }}>
      <Typography textAlign="center" fontWeight={600}>
        {goalValue} minutes
      </Typography>
 
      <Slider
        value={goalValue}
        min={5}
        max={120}
        step={5}
         valueLabelDisplay="auto"
        onChange={(_, v) => setGoalValue(v as number)}
      />
 
      <Button
        variant="contained"
        onClick={() => {
          setGoals((prev) => ({
            ...prev,
            [type]: goalValue,
          }));
          setOpen(false);
        }}
      >
        Save Goal
      </Button>
    </Stack>
  </DialogContent>
</Dialog>
 
    </MuiMetricCard>
  );
}
 
 