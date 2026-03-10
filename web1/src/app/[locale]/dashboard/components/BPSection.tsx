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
  useMediaQuery,
  alpha,
} from "@mui/material";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import type { BPRange, BPPoint } from "@/types/bp";
import BPChart from "../../components/BPChart";
import BPGauge from "../../components/BPGauge";
import { useTranslations } from "next-intl";
 
/* ================= BP STATUS ================= */
 
function classifyBP(sys?: number, dia?: number, t?: any) {
  if (!sys || !dia)
    return { label: t("noData"), color: "default", advice: t("noData") };
 
  if (sys < 90 || dia < 60)
    return { label: t("low"), color: "info", advice: t("lowAdvice") };
 
  if (sys < 120 && dia < 80)
    return { label: t("normal"), color: "success", advice: t("normalAdvice") };
 
  if (sys < 130 && dia < 80)
    return { label: t("elevated"), color: "warning", advice: t("elevatedAdvice") };
 
  if (sys < 140 || dia < 90)
    return { label: t("stage1"), color: "warning", advice: t("stage1Advice") };
 
  return { label: t("stage2"), color: "error", advice: t("stage2Advice") };
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
 
/* ================= TYPES ================= */
 
type DeviceOption = {
  id: string;
  name: string;
  type: string;
};
 
type Props = {
  range: BPRange;
  setRange: React.Dispatch<React.SetStateAction<BPRange>>;
  points: BPPoint[];
  latest: BPPoint | null;
  loadingBP: boolean;
  infoMessage?: string;
 
  currentDeviceId: string;   // main dashboard device
  activeDeviceId: string;    // selected BP device
  currentDeviceName: string;
 
  availableDevices?: DeviceOption[];
  onSwitchDevice: (id: string) => void;
};
 
/* ================= COMPONENT ================= */
 
export default function BPSection({
  range,
  setRange,
  points,
  latest,
  loadingBP,
  infoMessage = "",
 
  currentDeviceId,
  activeDeviceId,
  currentDeviceName,
 
  availableDevices = [],
  onSwitchDevice,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
 
  const t = useTranslations("bp");
 
  const bpStatus = classifyBP(latest?.systolic, latest?.diastolic, t);
 
  const ranges: BPRange[] = ["30m", "1h", "1d", "1w", "1m"];
 
  return (
    <Paper
     id="bp-section"
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 3,
        mb: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: theme.palette.background.paper,
      }}
    >
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
                background: `linear-gradient(135deg, ${theme.palette.info.light}, ${theme.palette.info.main})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <MonitorHeartIcon fontSize="small" />
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
 
        {/* RIGHT: DEVICES + FILTER */}
        <Grid item xs={12} md={8}>
         <Stack spacing={1.5} alignItems={{ xs: "flex-start", md: "flex-end" }}>
 
  {/* ROW → TOGGLE + DEVICE */}
  <Stack
    direction="row"
    spacing={2}
    flexWrap="wrap"
    alignItems="center"
    justifyContent={{ xs: "flex-start", md: "flex-end" }}
  >
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
          borderColor: alpha(theme.palette.primary.main, 0.2),
 
          "&.Mui-selected": {
            background: `linear-gradient(
              135deg,
              ${theme.palette.primary.main} 0%,
              ${theme.palette.primary.dark} 100%
            )`,
            color: "white",
          },
        },
      }}
    >
      {ranges.map((r) => (
        <ToggleButton key={r} value={r}>
          {r === "1w" ? "1W" : r.toUpperCase()}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
 
    {/* DEVICE SWITCH */}
    <Stack direction="row" spacing={1} flexWrap="wrap">
      <Chip
        label={currentDeviceName}
        color={activeDeviceId === currentDeviceId ? "primary" : "default"}
        variant={activeDeviceId === currentDeviceId ? "filled" : "outlined"}
        onClick={() => onSwitchDevice(currentDeviceId)}
      />
 
      {availableDevices?.map((d) => (
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
 
  {/* LAST MEASUREMENT BELOW */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      px: 2,
      py: 1,
      borderRadius: 2,
      background: alpha(theme.palette.primary.main, 0.05),
      border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
    }}
  >
    <Typography variant="body2" sx={{ fontWeight: 600 }}>
      {latest?.ts ? formatDateTime(latest.ts) : t("noData")}
    </Typography>
  </Box>
 
</Stack>
 
       
        </Grid>
      </Grid>
 
      {/* ================= CONTENT ================= */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <BPGauge
              systolic={latest?.systolic}
              diastolic={latest?.diastolic}
              pulse={latest?.pulse}
            />
          </Paper>
        </Grid>
 
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            {loadingBP ? (
              <CircularProgress />
            ) : infoMessage ? (
              <Typography color="text.secondary">{infoMessage}</Typography>
            ) : (
              <>
                <BPChart points={points} range={range} />
 
                <Box sx={{ mt: 3 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t("lastMeasurement")}
                  </Typography>
 
                  <Typography variant="h5" fontWeight={900}>
                    {latest?.systolic ?? "--"} /{" "}
                    {latest?.diastolic ?? "--"} mmHg
                  </Typography>
 
                  <Typography fontWeight={700}>
                   {t("pulse")}: {latest?.pulse ?? "--"} bpm
                  </Typography>
 
                  <Chip
                    label={bpStatus.label}
                    color={bpStatus.color as any}
                    sx={{ mt: 1 }}
                  />
 
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {bpStatus.advice}
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}
 
 
 
 