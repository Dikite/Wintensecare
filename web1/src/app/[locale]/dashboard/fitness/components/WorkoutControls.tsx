"use client";

import React from "react";
import {
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Stack,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { WorkoutType } from "@/types/exercise";

/* ================================
   START WORKOUT
================================ */

type StartWorkoutProps = {
  startWorkout: (type: WorkoutType) => void;
  selectedType: WorkoutType;
  onTypeChange: (t: WorkoutType) => void;
};


export function StartWorkout({
  startWorkout,
  selectedType,
  onTypeChange,
}: StartWorkoutProps) {
  const t = useTranslations("workoutControls");
  return (
    <Stack spacing={2}>
      <ToggleButtonGroup
        value={selectedType}
        exclusive
        onChange={(_, v) => v && onTypeChange(v)}
        fullWidth
      >
       <ToggleButton value="cardio">{t("cardio")}</ToggleButton>
        <ToggleButton value="hiit">{t("hiit")}</ToggleButton>
<ToggleButton value="walk">{t("walk")}</ToggleButton>
<ToggleButton value="run">{t("run")}</ToggleButton>
<ToggleButton value="gym">{t("gym")}</ToggleButton>
      </ToggleButtonGroup>

      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={() => startWorkout(selectedType)}
      >
      {t("startWorkout")}
      </Button>
    </Stack>
  );
}

/* ================================
   END WORKOUT
================================ */

type EndWorkoutProps = {
  endWorkout: () => void;
};

export function EndWorkout({ endWorkout }: EndWorkoutProps) {
    const t = useTranslations("workoutControls");
  return (
    <Button
      variant="contained"
      color="error"
      fullWidth
      onClick={endWorkout}
    >
     {t("endWorkout")}
    </Button>
  );
}
