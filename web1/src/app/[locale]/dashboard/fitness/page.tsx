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
} = useExercise(device?.id);

  const [selectedType, setSelectedType] =
  React.useState<WorkoutType>("cardio");

const totalDuration = history.reduce(
  (sum, w) => sum + (w.duration || 0),
  0
);


  const [historyOpen, setHistoryOpen] = React.useState(false);





  /* GYM MODE */
  const isGymWorkout =
  isLive && live?.type === "gym";

  const TARGET_MINUTES: Record<WorkoutType, number> = {
  cardio: 5000,
  hiit: 5000,
  walk: 1000,
  run: 1000,
  gym: 1000,
};

const doneMinutes = Math.round(
  history
    .filter((w) => w.type === selectedType)
    .reduce((sum, w) => sum + (w.duration || 0), 0) / 60
);

const targetMinutes = TARGET_MINUTES[selectedType];

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
  targetMinutes={targetMinutes}
  percent={percent}
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
