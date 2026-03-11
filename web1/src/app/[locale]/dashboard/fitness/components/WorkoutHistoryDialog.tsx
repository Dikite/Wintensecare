"use client";
 
import React from "react";
 
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Grid,
  Paper,
  Stack,
  Chip,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { WorkoutSession } from "@/types/exercise";
import { useTranslations } from "next-intl";
 
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
 
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
 
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
 
/* ---------------- Helpers ---------------- */
 
const getWorkoutIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "running":
      return <DirectionsRunIcon />;
    case "cycling":
      return <DirectionsBikeIcon />;
    case "strength":
      return <FitnessCenterIcon />;
    default:
      return <DirectionsRunIcon />;
  }
};
 
const getWorkoutBorderColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "running":
      return "#4CAF50";
    case "cycling":
      return "#2196F3";
    case "strength":
      return "#9C27B0";
    default:
      return "#90A4AE";
  }
};
 
const getHRZone = (hr: number | undefined, t: any) => {
if (hr < 100) return { label: t("zones.light"), color: "success" };
if (hr < 140) return { label: t("zones.moderate"), color: "warning" };
return { label: t("zones.intense"), color: "error" };
}
const groupWorkouts = (history: WorkoutSession[]) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
 
  const isSameDay = (d1: Date, d2: Date) =>
    d1.toDateString() === d2.toDateString();
  const t = useTranslations("workoutHistoryDialog");
 
  return {
    Today: history.filter((w) =>
      isSameDay(new Date(w.startTime), today)
    ),
    Yesterday: history.filter((w) =>
      isSameDay(new Date(w.startTime), yesterday)
    ),
    "This Week": history.filter((w) => {
      const date = new Date(w.startTime);
      const diff =
        (today.getTime() - date.getTime()) /
        (1000 * 60 * 60 * 24);
      return diff <= 7 && diff > 1;
    }),
  };
};
 
/* ---------------- Component ---------------- */
 
export default function WorkoutHistoryDialog({
  open,
  onClose,
  history,
}: {
  open: boolean;
  onClose: () => void;
  history: WorkoutSession[];
}) {
 
 
  const t = useTranslations("workoutHistoryDialog");
 
  const [selectedDate, setSelectedDate] = React.useState(new Date());
 
  const [calendarOpen, setCalendarOpen] = React.useState(false);
 
 
const filteredHistory = history.filter((w) => {
  const d = new Date(w.startTime);
 
  return (
    d.getFullYear() === selectedDate.getFullYear() &&
    d.getMonth() === selectedDate.getMonth() &&
    d.getDate() === selectedDate.getDate()
  );
});
 
  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      {/* HEADER */}
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <Typography sx={{ flex: 1 }} fontWeight={700}>
           {t("title")}
          </Typography>
 
          <IconButton edge="end" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
 
      {/* CONTENT */}
      <Box sx={{ p: 3 }}>
     
<Stack
  direction="row"
  alignItems="center"
  justifyContent="center"
  spacing={2}
  sx={{ mb: 3 }}
>
  <IconButton
    onClick={() =>
      setSelectedDate(
        new Date(selectedDate.getTime() - 86400000)
      )
    }
  >
    <ChevronLeftIcon />
  </IconButton>
 
  <Typography fontWeight={700}>
    {selectedDate.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })}
  </Typography>
 
  <IconButton
    disabled={
      selectedDate.toDateString() ===
      new Date().toDateString()
    }
    onClick={() =>
      setSelectedDate(
        new Date(selectedDate.getTime() + 86400000)
      )
    }
  >
    <ChevronRightIcon />
  </IconButton>
 
<LocalizationProvider dateAdapter={AdapterDayjs}>
  <IconButton onClick={() => setCalendarOpen(true)}>
    <CalendarMonthIcon />
  </IconButton>
 
  <DatePicker
    open={calendarOpen}
    onClose={() => setCalendarOpen(false)}
    value={dayjs(selectedDate)}
    onChange={(newValue) => {
      if (newValue) {
        setSelectedDate(newValue.toDate());
      }
      setCalendarOpen(false);
    }}
    slotProps={{
      textField: {
        sx: { display: "none" }
      }
    }}
  />
</LocalizationProvider>
 
</Stack>
 
 
{filteredHistory.length ? (
  <Box sx={{ mb: 4 }}>
    <Grid container spacing={3}>
      {filteredHistory.map((w) => {
        const hrZone = getHRZone(w.avgHR, t);
        const durationMinutes = Math.round(w.duration / 60);
 
        return (
          <Grid item xs={12} sm={6} md={4} key={w.id}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 3,
                borderLeft: `6px solid ${getWorkoutBorderColor(w.type)}`,
              }}
            >
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    {getWorkoutIcon(w.type)}
                    <Typography fontWeight={700}>
                      {w.type.toUpperCase()}
                    </Typography>
                  </Stack>
 
                  <Chip
                    label={`${durationMinutes} ${t("minutes")}`}
                    size="small"
                  />
                </Stack>
 
                <Box display="flex" justifyContent="center">
                  <CircularProgress
                    variant="determinate"
                    value={Math.min((durationMinutes / 60) * 100, 100)}
                    size={70}
                    thickness={5}
                  />
                </Box>
 
                <Typography variant="body2" color="text.secondary">
                  {t("calories")}: {w.calories ?? "--"}
                </Typography>
 
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" color="text.secondary">
                    {t("avgHR")}: {w.avgHR ?? "--"}
                  </Typography>
 
                  <Chip
                    label={hrZone.label}
                    color={hrZone.color as any}
                    size="small"
                  />
                </Stack>
 
                <Typography variant="caption" color="text.secondary">
                  {new Date(w.startTime).toLocaleString()}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  </Box>
) : null}
 
       {!filteredHistory.length && (
          <Typography color="text.secondary">
           {t("empty")}
          </Typography>
        )}
      </Box>
    </Dialog>
  );
}
 