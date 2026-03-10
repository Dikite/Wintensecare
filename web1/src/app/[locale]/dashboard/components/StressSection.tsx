"use client";
 
import React from "react";
import {
  Paper,
  Grid,
  Stack,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Chip,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import type { StressRange, StressPoint } from "@/types/stress";
import StressChart from "../../components/StressChart";
import StressDonut from "../../components/StressDonut";
import { useTranslations } from "next-intl";
import { buildStressPoints } from "@/lib/utils/stressUtils";
 
type DeviceOption = {
  id: string;
  name: string;
  type: string;
};
 
type Props = {
  range: StressRange;
  setRange: (v: StressRange) => void;
  points: StressPoint[];
  latest: StressPoint | null;
  loading: boolean;
  infoMessage?: string;
 
  currentDeviceId: string;
  activeDeviceId: string;
  currentDeviceName: string;
  availableDevices?: DeviceOption[];
  onSwitchDevice: (id: string) => void;
};
 
function formatDateTime(ts?: number) {
  if (!ts) return null;
 
  const d = new Date(ts);
  if (isNaN(d.getTime())) return null;
 
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}
 
export default function StressSection({
  range,
  setRange,
  points,
  latest,
  loading,
  infoMessage = "",
  currentDeviceId,
  activeDeviceId,
  currentDeviceName,
  availableDevices = [],
  onSwitchDevice,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
 const t = useTranslations("stress");
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
 
const chartPoints = points;
 
 
 const values = chartPoints
  .filter((p) => p.value != null)
  .map((p) => p.value as number);
 
 const current = latest?.value != null ? Math.round(latest.value) : null;
 
const min = values.length ? Math.round(Math.min(...values)) : null;
 
const max = values.length ? Math.round(Math.max(...values)) : null;
  return (
    <Paper
     id="stress-section"
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        mb: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
    {/* HEADER */}
<Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
 
  {/* LEFT: TITLE */}
  <Grid item xs={12} md={4}>
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.error.light}, ${theme.palette.error.main})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <PsychologyIcon fontSize="small" />
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
  </Grid>
 
  {/* RIGHT: STATS + TIME + DEVICES */}
  <Grid item xs={12} md={8}>
   <Stack
  direction="column"
  spacing={1.5}
  alignItems={{ xs: "flex-start", md: "flex-end" }}
>
  {/* Row: Stats + Toggle + Devices */}
  <Stack
    direction="row"
    spacing={2}
    flexWrap="wrap"
    justifyContent={{ xs: "flex-start", md: "flex-end" }}
    alignItems="center"
  >
 
      {/* STATS */}
      <Stack direction="row" spacing={3}>
        <Box textAlign="center">
          <Typography variant="caption" color="text.secondary">
         {t("current")}
          </Typography>
          <Typography fontWeight={900}>
            {current ?? "--"}
          </Typography>
        </Box>
 
        <Box textAlign="center">
          <Typography variant="caption" color="text.secondary">
          {t("min")}
          </Typography>
          <Typography fontWeight={700}>
            {min ?? "--"}
          </Typography>
        </Box>
 
        <Box textAlign="center">
          <Typography variant="caption" color="text.secondary">
          {t("max")}
          </Typography>
          <Typography fontWeight={700}>
            {max ?? "--"}
          </Typography>
        </Box>
      </Stack>
 
      {/* TIME RANGE */}
     <ToggleButtonGroup
  value={range}
  exclusive
  onChange={(_, v) => v && setRange(v)}
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
    value="30m"
    sx={{
      px: isMobile ? 1 : 1.5,
      fontSize: isMobile ? 12 : 14,
    }}
  >
    30m
  </ToggleButton>
 
  <ToggleButton
    value="1h"
    sx={{
      px: isMobile ? 1 : 1.5,
      fontSize: isMobile ? 12 : 14,
    }}
  >
    1H
  </ToggleButton>
 
  <ToggleButton
    value="8h"
    sx={{
      px: isMobile ? 1 : 1.5,
      fontSize: isMobile ? 12 : 14,
    }}
  >
    8H
  </ToggleButton>
 
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
</ToggleButtonGroup>
 
      {/* DEVICE CHIPS */}
      <Stack direction="row" spacing={1}>
        <Chip
          label={currentDeviceName}
          color={activeDeviceId === currentDeviceId ? "primary" : "default"}
          variant={activeDeviceId === currentDeviceId ? "filled" : "outlined"}
          onClick={() => onSwitchDevice(currentDeviceId)}
        />
 
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
 
        <Box
  sx={{
    display: "flex",
    alignItems: "center",
    px: 2,
    py: 1,
    borderRadius: 2,
    background: alpha(theme.palette.error.main, 0.05),
    border: `1px solid ${alpha(theme.palette.error.main, 0.15)}`,
  }}
>
  <Typography variant="body2" sx={{ fontWeight: 600 }}>
  {latest?.ts
  ? `${t("lastMeasurement")}: ${formatDateTime(latest.ts)}`
  : t("noData")}
  </Typography>
</Box>
 
    </Stack>
  </Grid>
</Grid>
 
      {/* CONTENT */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <StressDonut value={hoverValue ?? latest?.value ?? null} />
        </Grid>
 
        <Grid item xs={12} md={8}>
          {loading ? (
            <CircularProgress />
          ) : infoMessage ? (
            <Typography color="text.secondary">{infoMessage}</Typography>
          ) : (
            <StressChart
              points={points}
              range={range}
              onHoverValue={setHoverValue}
            />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
 
 