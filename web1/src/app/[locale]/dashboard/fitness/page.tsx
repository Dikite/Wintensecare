"use client";
import React from "react";
import { Container, Grid, Stack, Typography, Button } from "@mui/material";
import { useDashboard } from "@/hooks/useDashboard";
import { useExercise } from "@/hooks/useExercise";
 
import { useTranslations } from "next-intl";
 
 
/* FITNESS COMPONENTS */
import { StartWorkout, EndWorkout } from "./components/WorkoutControls";
import LiveWorkoutCard from "./components/LiveWorkoutCard";
import WeeklyStatsCard from "./components/WeeklyStatsCard";
import WorkoutHistory from "./components/WorkoutHistory";
import WeeklyFitnessActivityChart from "./components/WeeklyFitnessActivityChart";
import { WorkoutType } from "@/types/exercise";
import TypeActivityDonut from "./components/ActivityTypeDonut";
import TodayProgressChart from "./components/TodayProgressChart";
import WorkoutHistoryDialog from "./components/WorkoutHistoryDialog";
import ExerciseSlider from "./components/ExerciseSlider";
 
 
 
/* GYM MODE COMPONENTS */
import AddSetForm from "./components/AddSetForm";
import CreateExerciseForm from "./components/CreateExerciseForm";
 
export default function FitnessDashboard() {
  /* DEVICE */
  const { device } = useDashboard();
 
  const t = useTranslations("fitnessDashboard");
  /* WORKOUT */
const {
  weeklyStats,
  history,
  live,
  exercises,
  isLive,
  liveLoading,
  startWorkout,
  endWorkout,
  addSet,
  createExercise,
  todayStats
} = useExercise(device?.id);
 
 const [selectedType, setSelectedType] = React.useState<WorkoutType>(() => {
  if (typeof window === "undefined") return "cardio";
 
  const saved = localStorage.getItem("selectedWorkoutType");
  return (saved as WorkoutType) || "cardio";
});
 
 
React.useEffect(() => {
  localStorage.setItem("selectedWorkoutType", selectedType);
}, [selectedType]);
 
const totalDuration = history.reduce(
  (sum, w) => sum + (w.duration || 0),
  0
);
 
 
  const [historyOpen, setHistoryOpen] = React.useState(false);
 
 
 
 
 
  /* GYM MODE */
  const isGymWorkout =
  isLive && live?.type === "gym";
 
  const [goals, setGoals] = React.useState<Record<WorkoutType, number>>(() => {
  const saved = localStorage.getItem("fitnessGoals");
 
  return saved
    ? JSON.parse(saved)
    : {
        cardio: 30,
        hiit: 20,
        walk: 30,
        run: 25,
        gym: 40,
      };
});
 
React.useEffect(() => {
  const saved = localStorage.getItem("fitnessGoals");
  if (saved) {
    setGoals(JSON.parse(saved));
  }
}, []);
 
React.useEffect(() => {
  localStorage.setItem("fitnessGoals", JSON.stringify(goals));
}, [goals]);
 
 
 
 
const doneMinutes = todayStats?.[selectedType] || 0;
 
const targetMinutes = goals[selectedType];
 
const percent =
  targetMinutes > 0
    ? Math.min(
        100,
        Math.round((doneMinutes / targetMinutes) * 100)
      )
    : 0;
 
 
 
   
 
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* ================= HEADER ================= */}
      <Stack mb={3}>
        <Typography variant="h5" fontWeight={800}>
         {t("title")}
        </Typography>
        <Typography color="text.secondary">
        {t("subtitle")}
        </Typography>
      </Stack>
 
     
      {/* ================= START / END ================= */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
         {!liveLoading && !isLive && (
  <StartWorkout
    startWorkout={startWorkout}
    selectedType={selectedType}
    onTypeChange={setSelectedType}
  />
)}
 
{!liveLoading && isLive && (
  <EndWorkout endWorkout={endWorkout} />
)}
        </Grid>
 
        <Grid item xs={12} md={8}>
          {isLive && live && (
            <LiveWorkoutCard live={live} />
          )}
        </Grid>
      </Grid>
 
     {/* ================= ACTIVITY + TODAY PROGRESS ================= */}
<Grid container spacing={3} sx={{ mt: 3 }}>
  <Grid item xs={12} md={4}>
   <TypeActivityDonut
  type={selectedType}
  doneMinutes={doneMinutes}
  targetMinutes={goals[selectedType]}
  percent={percent}
  setGoals={setGoals}
/>
 
  </Grid>
 
  <Grid item xs={12} md={8}>
    <TodayProgressChart history={history} />
  </Grid>
</Grid>
 
 
      {/* ================= WEEKLY FITNESS ACTIVITY ================= */}
<Grid container spacing={3} sx={{ mt: 3 }}>
  <Grid item xs={12}>
    <WeeklyFitnessActivityChart history={history} />
  </Grid>
</Grid>
 
 
     
     {/* ================= GYM MODE (ONLY WHEN LIVE) ================= */}
{isLive && (
  <>
    <Grid container spacing={3} sx={{ mt: 3 }}>
      <Grid item xs={12} md={6}>
        <AddSetForm
          sessionId={live?.sessionId}
          exercises={exercises}
          addSet={addSet}
        />
      </Grid>
 
      <Grid item xs={12} md={6}>
        <CreateExerciseForm
          createExercise={createExercise}
        />
      </Grid>
    </Grid>
 
    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid item xs={12}>
        <ExerciseSlider exercises={exercises} />
      </Grid>
    </Grid>
  </>
)}
 
      {/* ================= WEEKLY STATS ================= */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <WeeklyStatsCard stats={weeklyStats} />
        </Grid>
      </Grid>
 
 
 
      {/* ================= VIEW HISTORY BUTTON (BOTTOM) ================= */}
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          onClick={() => setHistoryOpen(true)}
        >
        {t("viewHistory")}
        </Button>
      </Grid>
 
      {/* ================= HISTORY DIALOG ================= */}
      <WorkoutHistoryDialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
      />
    </Container>
  );
}
 
 