"use client";

import React from "react";
import { Stack, TextField, Button, MenuItem } from "@mui/material";
import { useTranslations } from "next-intl";

type Props = {
  createExercise: (data: {
    name: string;
    muscleGroup: string;
  }) => Promise<any>;
};

export default function CreateExerciseForm({
  createExercise,
}: Props) {
  const [name, setName] = React.useState("");
  const [muscleGroup, setMuscleGroup] = React.useState("");

  const handleCreate = async () => {
    if (!name || !muscleGroup) return;

    await createExercise({ name, muscleGroup });

    setName("");
    setMuscleGroup("");
  };
  const t = useTranslations("createExerciseForm");

  return (
    <Stack spacing={2}>
      <TextField
       label={t("exerciseName")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />

      {/* ✅ ADD MUSCLE GROUP SELECT HERE */}
      <TextField
        select
      label={t("muscleGroup")}
        value={muscleGroup}
        onChange={(e) => setMuscleGroup(e.target.value)}
        fullWidth
      >
     <MenuItem value="CHEST">{t("muscles.CHEST")}</MenuItem>
<MenuItem value="BACK">{t("muscles.BACK")}</MenuItem>
<MenuItem value="LEGS">{t("muscles.LEGS")}</MenuItem>
<MenuItem value="SHOULDERS">{t("muscles.SHOULDERS")}</MenuItem>
<MenuItem value="BICEPS">{t("muscles.BICEPS")}</MenuItem>
<MenuItem value="TRICEPS">{t("muscles.TRICEPS")}</MenuItem>
<MenuItem value="CORE">{t("muscles.CORE")}</MenuItem>
<MenuItem value="FULL_BODY">{t("muscles.FULL_BODY")}</MenuItem>
      </TextField>

      <Button
        variant="outlined"
        onClick={handleCreate}
        disabled={!name || !muscleGroup}
      >
  {t("createExercise")}
      </Button>
    </Stack>
  );
}
