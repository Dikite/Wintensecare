"use client";
 
import React from "react";
import {
  Paper,
  Typography,
  Stack,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Box,
  Grid,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
 
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import GlucoseChart from "../../components/GlucoseChart";
import { useGlucose } from "@/hooks/useGlucose";
import GlucoseGauge from "../../components/GlucoseGauge";
 
import { useTranslations } from "next-intl";
 
type DeviceOption = {
  id: string;
  name: string;
  type: string;
};
 
type Props = {
  currentDeviceId: string;
  activeDeviceId: string;
  currentDeviceName: string;
  availableDevices?: DeviceOption[];
  onSwitchDevice: (id: string) => void;
};
 
function classifyGlucose(value?: number, t?: any) {
  if (value == null) return { label: t("noData"), color: "default" };
  if (value < 70) return { label: t("low"), color: "warning" };
  if (value <= 140) return { label: t("normal"), color: "success" };
  return { label: t("high"), color: "error" };
}
 
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
 
 
 
export default function GlucoseSection({
  currentDeviceId,
  activeDeviceId,
  currentDeviceName,
  availableDevices = [],
  onSwitchDevice,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
 
  const t = useTranslations("glucose");
 
  const { range, setRange, points, latest, loading, initialLoad } =
    useGlucose(activeDeviceId, "1d");
 
  const status = classifyGlucose(latest?.glucose, t);
 
  return (
    <Paper
     id="glucose-section"
      sx={{ p: 3, borderRadius: 3 }}>
 
      {/* HEADER */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <Stack direction="row" spacing={1.5} alignItems="center">
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
              <BloodtypeIcon fontSize="small" />
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
 
        <Grid item xs={12} md={8}>
         <Stack
  direction="column"
  spacing={1.5}
  alignItems={{ xs: "flex-start", md: "flex-end" }}
>
   <Stack
    direction="row"
    spacing={2}
    flexWrap="wrap"
    justifyContent={{ xs: "flex-start", md: "flex-end" }}
    alignItems="center"
  >
 
            {/* RANGE */}
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
 
            {/* DEVICES */}
            <Stack direction="row" spacing={1}>
              <Chip
                label={currentDeviceName}
                color={activeDeviceId === currentDeviceId ? "primary" : "default"}
                variant={activeDeviceId === currentDeviceId ? "filled" : "outlined"}
                onClick={() => onSwitchDevice(currentDeviceId)}
              />
 
              {availableDevices.map(d => (
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
    background: alpha(theme.palette.success.main, 0.05),
    border: `1px solid ${alpha(theme.palette.success.main, 0.15)}`,
  }}
>
  <Typography variant="body2" sx={{ fontWeight: 600 }}>
    {latest?.ts
      ? formatDateTime(latest.ts)
      :  t("noData")}
  </Typography>
</Box>
          </Stack>
        </Grid>
      </Grid>
 
      {/* VALUE */}
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight={900}>
          {latest?.glucose ?? "--"} mg/dL
        </Typography>
        <Chip label={status.label} color={status.color as any} />
      </Stack>
 
      {/* CHART */}
      {/* CHART + GAUGE LAYOUT */}
<Grid container spacing={3}>
  {/* LEFT → Gauge */}
  <Grid item xs={12} md={4}>
    <GlucoseGauge value={latest?.glucose} />
  </Grid>
 
  {/* RIGHT → Chart */}
  <Grid item xs={12} md={8}>
    <Box position="relative">
      <GlucoseChart points={points} range={range} />
 
      {loading && !initialLoad && (
        <Box sx={{ position: "absolute", top: 8, right: 8 }}>
          <CircularProgress size={18} />
        </Box>
      )}
 
      {initialLoad && loading && (
        <Stack alignItems="center" py={5}>
          <CircularProgress />
        </Stack>
      )}
    </Box>
  </Grid>
</Grid>
    </Paper>
  );
}
 
 