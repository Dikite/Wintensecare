"use client";

import React from "react";
import {
  Stack,
  TextField,
  Button,
  MenuItem,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Exercise } from "@/types/exercise";
import { useTranslations } from "next-intl";

type Props = {
  sessionId: string;
  exercises: Exercise[];
  addSet: (data: {
    sessionId: string;
    exerciseId: string;
    reps: number;
    weight: number;
  }) => Promise<any>;
};

export default function AddSetForm({
  sessionId,
  exercises,
  addSet,
}: Props) {
  const [exerciseId, setExerciseId] = React.useState("");
  const [reps, setReps] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [successOpen, setSuccessOpen] = React.useState(false);
const t = useTranslations("exerciseForm");
  const handleAddSet = async () => {
    if (!exerciseId || !reps || !weight) return;

    await addSet({
      sessionId,
      exerciseId,
      reps: Number(reps),
      weight: Number(weight),
    });

    setReps("");
    setWeight("");
    setSuccessOpen(true); // ✅ SHOW SUCCESS
  };

  return (
    <>
      <Stack spacing={2}>
        <Typography fontWeight={700}>
         {t("title")}
        </Typography>

        <TextField
          select
        label={t("exercise")}
          value={exerciseId}
          onChange={(e) => setExerciseId(e.target.value)}
          fullWidth
        >
          {exercises.map((ex) => (
            <MenuItem key={ex.id} value={ex.id}>
              {ex.name} ({ex.muscleGroup})
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label={t("reps")}
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          inputProps={{ min: 1 }}
        />

        <TextField
         label={t("weight")}
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          inputProps={{ min: 0 }}
        />

        <Button
          variant="contained"
          onClick={handleAddSet}
          disabled={!sessionId || !exerciseId || !reps || !weight}
        >
          {t("saveSet")}
        </Button>

        {!sessionId && (
          <Typography fontSize={12} color="text.secondary">
           {t("startWorkout")}
          </Typography>
        )}
      </Stack>

      {/* ✅ SUCCESS MESSAGE */}
      <Snackbar
        open={successOpen}
        autoHideDuration={2500}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
         {t("success")} ✅
        </Alert>
      </Snackbar>
    </>
  );
}
