"use client";
 
import React, { useMemo } from "react";
import {
  Paper,
  Stack,
  Grid,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  alpha,
  useMediaQuery,
  Chip,
  Button,
} from "@mui/material";
 
import type { SleepRange, SleepSession } from "@/types/sleep";
import SleepChart from "../../components/SleepChart";
import SleepRatioDonut from "../../components/SleepRatioDonut";
import SleepTimeline1D from "../../components/SleepTimeline1D";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useTranslations } from "next-intl";
 
/* ✅ AM/PM format */
function formatAMPM(ts: string) {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
 
function minsToText(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}
 
function calcEfficiency(s: SleepSession) {
  const asleep =
    (s.deepMinutes || 0) + (s.lightMinutes || 0) + (s.remMinutes || 0);
  const total = asleep + (s.awakeMinutes || 0);
  if (!total) return 0;
  return Math.round((asleep / total) * 100);
}
 
function formatDateTime(ts: string) {
  return new Date(ts).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}
 
type DeviceOption = {
  id: string;
  name: string;
};
 
type Props = {
  rangeSleep: SleepRange;
  setRangeSleep: (v: SleepRange) => void;
  sleepSessions: SleepSession[];
  latestSleep: SleepSession | null;
  loadingSleep: boolean;
 
  currentDeviceId: string;   // main dashboard device
  activeDeviceId: string;    // selected sleep device
  currentDeviceName: string;
 
  availableDevices?: DeviceOption[];
  onSwitchDevice: (id: string) => void;
};
 
 
export default function SleepSection({
  rangeSleep,
  setRangeSleep,
  sleepSessions,
  latestSleep,
  loadingSleep,
  currentDeviceId,
  activeDeviceId,
  currentDeviceName,
  availableDevices = [],
  onSwitchDevice,
}: Props)
 {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
 
  const t = useTranslations("sleep");
 
  const avgSleepMinutes = useMemo(() => {
    if (!sleepSessions.length) return 0;
    const sum = sleepSessions.reduce(
      (acc, s) => acc + (s.totalMinutes || 0),
      0
    );
    return Math.round(sum / sleepSessions.length);
  }, [sleepSessions]);
 
  const efficiency = latestSleep ? calcEfficiency(latestSleep) : 0;
 
  const scheduleText =
    latestSleep?.startTime && latestSleep?.endTime
      ? `${formatAMPM(latestSleep.startTime)} - ${formatAMPM(
          latestSleep.endTime
        )}`
      : "--";
 
  return (
    <Paper
    id="sleep-section"
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 4,
        mt: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        background: theme.palette.background.paper,
      }}
    >
     {/* HEADER */}
{/* ================= HEADER ================= */}
<Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
 
  {/* LEFT: TITLE */}
  <Grid item xs={12} md={4}>
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <BedtimeIcon fontSize="small" />
      </Box>
 
      <Box>
        <Typography variant="h6" fontWeight={700}>
          {t("title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("subtitle")}
        </Typography>
      </Box>
    </Stack>
 
    <Typography sx={{ mt: 1 }} fontSize={13} fontWeight={700}>
     {t("latestSleep")}:{" "}
      <span style={{ fontWeight: 900 }}>
        {latestSleep ? minsToText(latestSleep.totalMinutes) : "--"}
      </span>
    </Typography>
 
{/* LAST MEASUREMENT DATE & TIME */}
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 1,
    px: 2,
    py: 1,
    mt: 1,
    borderRadius: 2,
    background: alpha(theme.palette.primary.main, 0.05),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
    width: "fit-content",
  }}
>
  <AccessTimeIcon
    sx={{ fontSize: 16, color: theme.palette.primary.main }}
  />
 
  <Typography variant="body2" sx={{ fontWeight: 600 }}>
    {latestSleep?.startTime
      ? formatDateTime(latestSleep.startTime)
      : t("noData")}
  </Typography>
</Box>
  </Grid>
 
  {/* RIGHT: BUTTONS + RANGE + DEVICES */}
  <Grid item xs={12} md={8}>
  <Stack
    direction="row"
    spacing={2}
    alignItems="center"
    justifyContent="flex-end"
    flexWrap="wrap"
  >
    {/* TIME RANGE */}
   <ToggleButtonGroup
  value={rangeSleep}
  exclusive
  onChange={(_, v) => v && setRangeSleep(v)}
  size={isMobile ? "small" : "medium"}
  sx={{
    "& .MuiToggleButton-root": {
      px: isMobile ? 1.5 : 2,
      py: 0.5,
      borderRadius: 2,
      borderColor: alpha(theme.palette.success.main, 0.2),
 
      "&.Mui-selected": {
        background: `linear-gradient(
          135deg,
          ${theme.palette.success.main} 0%,
          ${theme.palette.success.dark} 100%
        )`,
        color: "white",
      },
    },
  }}
>
  <ToggleButton
    value="1d"
    sx={{
      px: isMobile ? 1 : 1.5,
      fontSize: isMobile ? 12 : 14,
    }}
  >
    1D
  </ToggleButton>
 
  <ToggleButton
    value="1w"
    sx={{
      px: isMobile ? 1 : 1.5,
      fontSize: isMobile ? 12 : 14,
    }}
  >
    1W
  </ToggleButton>
 
  <ToggleButton
    value="2w"
    sx={{
      px: isMobile ? 1 : 1.5,
      fontSize: isMobile ? 12 : 14,
    }}
  >
    2W
  </ToggleButton>
 
  <ToggleButton
    value="1m"
    sx={{
      px: isMobile ? 1 : 1.5,
      fontSize: isMobile ? 12 : 14,
    }}
  >
    1M
  </ToggleButton>
</ToggleButtonGroup>
    {/* DEVICE SWITCH */}
 
<Stack direction="row" spacing={1} flexWrap="wrap">
  {/* MAIN DASHBOARD DEVICE */}
  <Chip
    label={currentDeviceName}          // e.g. Watch Wintensecare
    color={activeDeviceId === currentDeviceId ? "primary" : "default"}
    variant={activeDeviceId === currentDeviceId ? "filled" : "outlined"}
    onClick={() => onSwitchDevice(currentDeviceId)}
  />
 
  {/* OTHER SLEEP DEVICES (e.g. My Watch) */}
  {availableDevices.map((d) => (
    <Chip
      key={d.id}
      label={d.name}
      color={activeDeviceId === d.id ? "primary" : "default"}
      variant={activeDeviceId === d.id ? "filled" : "outlined"}
      onClick={() => onSwitchDevice(d.id)}
    />
  ))}
</Stack>
 
  </Stack>
</Grid>
</Grid>
 
      {/* MAIN GRID */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ mt: 2 }}
      >
        {/* LEFT: CHART */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {loadingSleep ? (
            <Box
              sx={{
                height: 260,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography fontSize={13} color="text.secondary">
                 {t("loading")}
              </Typography>
            </Box>
          ) : sleepSessions.length === 0 ? (
            <Box
              sx={{
                height: 260,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography fontSize={13} color="text.secondary">
               {t("noSleepData")}
              </Typography>
            </Box>
          ) : (
            // ✅ If your SleepChart supports rangeSleep, keep it:
           rangeSleep === "1d" ? (
  <SleepTimeline1D latestSleep={latestSleep} />
) : (
  <SleepChart sessions={sleepSessions} rangeSleep={rangeSleep} />
)
 
 
            // ❗ If your SleepChart DOES NOT accept rangeSleep, use this instead:
            // <SleepChart sessions={sleepSessions} />
          )}
        </Box>
 
        {/* RIGHT: DONUT */}
        <Box
  sx={{
    width: { xs: "100%", md: 320 },
    flexShrink: 0,
    minHeight: 260, // 🔥 IMPORTANT FIX
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
 
          <SleepRatioDonut latestSleep={latestSleep} />
        </Box>
      </Stack>
     
 
      {/* STATS */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mt: 2 }}
      >
        <Box
          sx={{
            flex: 1,
            p: 2,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          }}
        >
          <Typography fontSize={12} color="text.secondary">
            {t("averageSleep")}
          </Typography>
          <Typography fontSize={22} fontWeight={900}>
            {avgSleepMinutes ? minsToText(avgSleepMinutes) : "--"}
          </Typography>
        </Box>
 
        <Box
          sx={{
            flex: 1,
            p: 2,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          }}
        >
          <Typography fontSize={12} color="text.secondary">
            {t("efficiency")}
          </Typography>
          <Typography fontSize={22} fontWeight={900}>
            {latestSleep ? `${efficiency}%` : "--"}
          </Typography>
 
          {latestSleep && (
            <Chip
              size="small"
              label={
                efficiency >= 85
                 ? t("good")
                 : efficiency >= 70
                 ? t("moderate")
                 : t("low")
              }
              color={
                efficiency >= 85
                  ? "success"
                  : efficiency >= 70
                  ? "warning"
                  : "error"
              }
              sx={{ mt: 1, fontWeight: 800 }}
            />
          )}
        </Box>
      </Stack>
 
      {/* SCHEDULE */}
      <Box
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        }}
      >
        <Typography fontSize={12} color="text.secondary">
          {t("schedule")}
        </Typography>
        <Typography fontSize={16} fontWeight={900}>
          {scheduleText}
        </Typography>
      </Box>
    </Paper>
  );
}
 
 