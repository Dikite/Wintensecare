"use client";

import React from "react";
import {
  Paper,
  Stack,
  Typography,
  Chip,
  Box,
  IconButton,
} from "@mui/material";
import { useTranslations } from "next-intl";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { Exercise } from "@/types/exercise";

/* ===============================
   SINGLE EXERCISE CARD
================================ */


function ExerciseCard({ exercise }: { exercise: Exercise }) {

  const createdDate =
    exercise.createdAt && !isNaN(Date.parse(exercise.createdAt))
      ? new Date(exercise.createdAt)
      : null;
  const t = useTranslations("exerciseSlider");
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid rgba(15,23,42,0.08)",
        boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
        minWidth: 220,
      }}
    >
      <Stack spacing={1}>
        <Typography fontWeight={700}>
          {exercise.name}
        </Typography>

        <Chip
          label={exercise.muscleGroup}
          size="small"
          color="info"
          sx={{ width: "fit-content" }}
        />

     <Typography variant="caption" color="text.secondary">
  {createdDate ? (
    <>
      {t("firstUsed")}{" "}
      {createdDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}{" "}
      •{" "}
      {createdDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}
    </>
  ) : (
    t("notUsed")
  )}
</Typography>
      </Stack>
    </Paper>
  );
}

/* ===============================
   SLIDER (MAX 3 VISIBLE)
================================ */

const VISIBLE_COUNT = 3;
const CARD_WIDTH = 240;

export default function ExerciseSlider({
  
  exercises,
}: {
  exercises: Exercise[];
}) {
  const [index, setIndex] = React.useState(0);

  const maxIndex = Math.max(0, exercises.length - VISIBLE_COUNT);

  const next = () => setIndex((i) => Math.min(i + 1, maxIndex));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));
const t = useTranslations("exerciseSlider");
  if (!exercises.length) {
    return (
      <Typography color="text.secondary" fontSize={14}>
       {t("empty")}
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontWeight={700}>
          {t("title")}
        </Typography>

        <Stack direction="row">
          <IconButton size="small" onClick={prev} disabled={index === 0}>
            <ChevronLeftIcon />
          </IconButton>

          <IconButton size="small" onClick={next} disabled={index === maxIndex}>
            <ChevronRightIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* SLIDER */}
      <Box sx={{ overflow: "hidden" }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            transform: `translateX(-${index * CARD_WIDTH}px)`,
            transition: "transform 0.3s ease",
          }}
        >
          {exercises.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
