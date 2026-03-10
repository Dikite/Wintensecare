"use client";

import { MuiMetricCard } from "../../components/MuiMetricCard";
import { Stack, Typography, Box, Grid } from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { useRouter } from "@/navigation";
import { WorkoutSession } from "@/types/exercise";
import { useTranslations } from "next-intl";

/* ================================
   ACTIVITY RINGS
================================ */
function ActivityRings({
  size = 128,
  moveValue,
  exerciseValue,
  walkValue,
  moveGoal,
  exerciseGoal,
  walkGoal,
}: {
  size?: number;
  moveValue: number;
  exerciseValue: number;
  walkValue: number;
  moveGoal: number;
  exerciseGoal: number;
  walkGoal: number;
}) {
  const stroke = 10;
  const gap = 4;
  const center = size / 2;

  const rMove = center - stroke;
  const rExercise = rMove - stroke - gap;
  const rWalk = rExercise - stroke - gap;
const t = useTranslations("exerciseMetric");
  const C = (r: number) => 2 * Math.PI * r;
  const offset = (v: number, g: number, r: number) =>
    C(r) * (1 - Math.min(v / g, 1));

  const Ring = ({
    r,
    bg,
    fg,
    value,
    goal,
  }: {
    r: number;
    bg: string;
    fg: string;
    value: number;
    goal: number;
  }) => (
    <>
      <circle
        cx={center}
        cy={center}
        r={r}
        stroke={bg}
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={center}
        cy={center}
        r={r}
        stroke={fg}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={C(r)}
        strokeDashoffset={offset(value, goal, r)}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
      />
    </>
  );

  return (
    <svg width={size} height={size}>
      <Ring r={rMove} bg="#fbd5db" fg="#ef4444" value={moveValue} goal={moveGoal} />
      <Ring
        r={rExercise}
        bg="#dcfce7"
        fg="#22c55e"
        value={exerciseValue}
        goal={exerciseGoal}
      />
      <Ring r={rWalk} bg="#e0f2fe" fg="#0a8bc7" value={walkValue} goal={walkGoal} />
    </svg>
  );
}

/* ================================
   HELPERS
================================ */
function getTodayStats(history: WorkoutSession[]) {
  const today = new Date().toISOString().slice(0, 10);
const t = useTranslations("exerciseMetric");
  const todaySessions = history.filter(
    (w) => w.startTime.slice(0, 10) === today
  );

  const calories = todaySessions.reduce(
    (sum, w) => sum + (w.calories ?? 0),
    0
  );

  const exerciseMin = Math.round(
    todaySessions.reduce((sum, w) => sum + (w.duration ?? 0), 0) / 60
  );

  return {
    calories,
    exerciseMin,
    workouts: todaySessions.length,
  };
}

/* ================================
   MAIN CARD
================================ */
type Props = {
  history: WorkoutSession[];
};

export default function ExerciseMetricCard({ history }: Props) {
  const router = useRouter();
const t = useTranslations("exerciseMetric");
  /* LIVE STATE */
  const isLive = history.some((w) => w.status === "ACTIVE");

  /* GOALS */
  const MOVE_GOAL = 2000;
  const EXERCISE_GOAL = 400;
  const WALK_GOAL = 12;

  const today = getTodayStats(history);

  const move = today.calories;
  const exerciseMin = today.exerciseMin;
  const workouts = today.workouts;
  const walkHr = Math.round(exerciseMin / 60);

  return (
    <MuiMetricCard
      title={
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography fontWeight={700}>{t("title")}</Typography>

          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: isLive ? "#ef4444" : "#9ca3af",
            }}
          />

          <Typography
            fontWeight={700}
            fontSize={12}
            letterSpacing={0.6}
            color={isLive ? "#22c55e" : "#6b7280"}
          >
           {isLive ? t("live") : t("inactive")}
          </Typography>
        </Stack>
      }
      icon={<FitnessCenterIcon />}
      iconColor="#ef4444"
      sx={{ height: 220, cursor: "pointer" }}
      onClick={() => router.push("/dashboard/fitness")}
    >
      <Grid container alignItems="center" height="100%" columnSpacing={3}>
        {/* LEFT */}
        <Grid item xs="auto" sx={{ minWidth: 240 }}>
          <Stack spacing={1}>
            <Typography fontWeight={700} color="#ef4444">
             {t("move")} — {move}/{MOVE_GOAL} kcal
            </Typography>
            <Typography fontWeight={700} color="#22c55e">
            {t("exercise")} — {exerciseMin}/{EXERCISE_GOAL} min
            </Typography>
            <Typography fontWeight={700} color="#0a8bc7">
            {t("walking")} — {walkHr}/{WALK_GOAL} hr
            </Typography>
          </Stack>
        </Grid>

        {/* CENTER */}
        <Grid item xs>
          <Stack spacing={0.6} alignItems="center" textAlign="center">
            <Typography fontWeight={700}>{workouts} {t("workouts")}</Typography>
            <Typography fontWeight={700} color="#22c55e">
             {t("totalDuration")} — {exerciseMin} min
            </Typography>
          </Stack>
        </Grid>

        {/* RIGHT */}
        <Grid item xs="auto" sx={{ minWidth: 160, pr: 2 }}>
          <ActivityRings
            moveValue={move}
            exerciseValue={exerciseMin}
            walkValue={walkHr}
            moveGoal={MOVE_GOAL}
            exerciseGoal={EXERCISE_GOAL}
            walkGoal={WALK_GOAL}
          />
        </Grid>
      </Grid>
    </MuiMetricCard>
  );
}
