"use client";
 
import React from "react";
import { Grid, Box, Chip, Typography, useTheme, useMediaQuery } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import BatteryStdIcon from "@mui/icons-material/BatteryStd";
import { MetricValue } from "../../components/MetricValue";
import { MuiMetricCard } from "../../components/MuiMetricCard";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
 
import OpacityIcon from "@mui/icons-material/Opacity";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import type { SleepSession } from "@/types/sleep";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import type { ChipProps } from "@mui/material";
import type { StressPoint } from "@/types/stress";
 
import ExerciseMetricCard from "./ExerciseMetricCard";
import { useExercise } from "@/hooks/useExercise";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import { useGlucose } from "@/hooks/useGlucose";
 
function formatMeasured(ts?: string | number | null) {
  if (!ts) return null;
 
  const d = new Date(ts);
 
  const time = d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
 
  const date = d.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
 
  return `${time} • ${date}`;
}
 
 
type Props = {
  latestTelemetry: any;
  avgHeartRate1h: number | null;
  dailySteps: number | null;
  stepPoints?: { ts: string; steps: number }[];
  totalSteps: number;
  loadingHeart: boolean;
  loadingSteps: boolean;
  latestECGTime: string | null;
 
  spo2Points: { avg: number; ts: string }[];
  loadingSpO2: boolean;
 
  sleepSessions: SleepSession[];
  loadingSleep: boolean;
 
    latestBP: {
  systolic: number;
  diastolic: number;
  pulse?: number;
  measuredAt?: string | number;
} | null;
  loadingBP: boolean;
 
  latestGlucose?: {
  glucose: number;
  ts: number;
} | null;
 
  latestTemp: {
  value: number;
  measuredAt?: number;
} | null;
 
loadingTemp: boolean;
 
latestStress: StressPoint | null;
loadingStress: boolean;
 
 
 
 
};
 
 
export default function DashboardMetricGrid({
  latestTelemetry,
  avgHeartRate1h,
  dailySteps,

  loadingHeart,
  loadingSteps,
  latestECGTime,
  spo2Points,
  loadingSpO2,
  sleepSessions,
  loadingSleep,
 
  latestBP,
  loadingBP,
 
  latestGlucose,
 
  latestTemp,
  loadingTemp,
 
   latestStress,
  loadingStress,
}: Props) {
 const t = useTranslations("dashboard");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
 
  const getHeartRateStatus = (rate?: number) => {
    if (!rate) return "default";
    if (rate >= 100) return "error";
    if (rate >= 90) return "warning";
    if (rate >= 60 && rate <= 89) return "success";
    return "info";
  };
 
  // -------- Blood Pressure ----------
const getBPStatus = (
  sys?: number,
  dia?: number
): { label: string; color: ChipProps["color"] } => {
  if (!sys || !dia) return { label: "No data", color: "default" };
  if (sys < 120 && dia < 80) return { label: "Normal", color: "success" };
  if (sys < 140 || dia < 90) return { label: "Elevated", color: "warning" };
  return { label: "High", color: "error" };
};
 
const getBpMeasuredTime = (
  bp: Props["latestBP"] | any
): string | number | null => {
  if (!bp) return null;
 
  if ("measuredAt" in bp && bp.measuredAt) return bp.measuredAt;
  if ("ts" in bp && bp.ts) return bp.ts;
 
  return null;
};
 
 
const getGlucoseStatus = (
  value?: number
): { label: string; color: ChipProps["color"] } => {
  if (value === undefined || value === null)
    return { label: "No data", color: "default" };
  if (value < 70) return { label: "Low", color: "warning" };
  if (value <= 140) return { label: "Normal", color: "success" };
  return { label: "High", color: "error" };
};
 
const glucoseStatus = getGlucoseStatus(latestGlucose?.glucose);
 
 
 
// -------- Temperature ----------
const getTempStatus = (
  temp?: number
): { label: string; color: ChipProps["color"] } => {
  if (!temp) return { label: "No data", color: "default" };
  if (temp < 37.5) return { label: "Normal", color: "success" };
  if (temp < 38.5) return { label: "Mild Fever", color: "warning" };
  return { label: "High Fever", color: "error" };
};
 
 
 
// -------- Stress ----------
const getStressStatus = (
  value?: number
): { label: string; color: ChipProps["color"] } => {
  if (value === null || value === undefined)
    return { label: "No data", color: "default" };
  if (value < 40) return { label: "Relaxed", color: "success" };
  if (value < 70) return { label: "Moderate", color: "warning" };
  return { label: "High", color: "error" };
};
 
 
const latestSpO2 = spo2Points?.at(-1)?.avg ?? null;
 
const getSpO2Status = (value?: number) => {
  if (!value) return { label: "No data", color: "default" };
  if (value >= 95) return { label: "Normal", color: "success" };
  if (value >= 90) return { label: "Slightly Low", color: "warning" };
  return { label: "Low", color: "error" };
};
 
const spo2Status = getSpO2Status(latestSpO2);
 
const bpStatus = getBPStatus(
latestBP?.systolic,
latestBP?.diastolic
);
 
 
 
const tempStatus = getTempStatus(latestTelemetry?.skinTemperature);
 
const stressStatus = getStressStatus(latestStress?.value);

 
const latestSleep = sleepSessions?.at(-1) ?? null;
const sleepHours1d = latestSleep ? Math.round(latestSleep.totalMinutes / 60) : null;
 
const { weeklyStats, history } = useExercise();
 
const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};
 
const [stableGlucose, setStableGlucose] = React.useState<number | null>(null);
const [stableGlucoseTs, setStableGlucoseTs] =
  React.useState<string | number | null>(null);
 
React.useEffect(() => {
  if (latestGlucose?.glucose != null) {
    setStableGlucose(latestGlucose.glucose);
    setStableGlucoseTs(latestGlucose.ts ?? null);
  }
}, [latestGlucose]);
 
const [stableTemp, setStableTemp] = React.useState<number | null>(null);
const [stableTempTs, setStableTempTs] = React.useState<number | null>(null);
 
React.useEffect(() => {
  if (latestTemp?.value != null) {
    setStableTemp(latestTemp.value);
    setStableTempTs(latestTemp.measuredAt ?? null);
  }
}, [latestTemp]);
 
 
  return (
 
   
    <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: 4 }}>
 
<Grid item xs={12} sm={12} lg={6}>
  <ExerciseMetricCard history={history} />
</Grid>
 
 
      <Grid item xs={12} sm={6} lg={3}>
        <MuiMetricCard
        title={t("heartRate.title")}
          icon={<FavoriteIcon />}
          iconColor="#e53935"
          accent="#ffeef0"
          loading={loadingHeart}
          sx={{ height: "100%",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: 6,
  }, }}
    onClick={() => scrollToSection("heart-section")}
        >
          <Box sx={{ textAlign: "center", py: 1 }}>
  <MetricValue
    value={`${latestTelemetry?.heartRate ?? "--"}`}
    unit="bpm"
  label={t("heartRate.currentRate")}
   
    size={isMobile ? "medium" : "large"}
  />
 
  {latestTelemetry?.measuredAt && (
    <Typography variant="caption" color="text.secondary">
     {t("common.lastMeasured")}  {formatMeasured(latestTelemetry.measuredAt)}
    </Typography>
  )}
</Box>
 
<Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
  <Chip
   label={
  getHeartRateStatus(latestTelemetry?.heartRate) === "success"
    ? t("heartRate.normal")
    : t("heartRate.monitor")
}
    size="small"
    color={getHeartRateStatus(latestTelemetry?.heartRate)}
    sx={{ fontWeight: 600 }}
  />
</Box>
        </MuiMetricCard>
      </Grid>
 
      <Grid item xs={12} sm={6} lg={3}>
  <MuiMetricCard
   title={t("steps.title")}
    icon={<DirectionsRunIcon />}
    iconColor="#6a1b9a"
    accent="#f4ecff"
    loading={false}
    sx={{ height: "100%",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: 6,
  }, }}
  onClick={() => scrollToSection("steps-section")}
  >
    <Box sx={{ textAlign: "center", py: 1 }}>
 <MetricValue
   value={dailySteps ?? "--"}
  unit="steps"
 label={t("steps.today")}
  size={isMobile ? "medium" : "large"}
/>
</Box>
 
<Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
<Chip
  label={
    loadingSteps
      ? t("steps.loading")
      : (dailySteps ?? 0) > 5000
      ? t("steps.active")
      : t("steps.moderate")
  }
  size="small"
  color={
    loadingSteps
      ? "default"
      : (dailySteps ?? 0) > 5000
      ? "success"
      : "info"
  }
  sx={{ fontWeight: 600 }}
/>
</Box>
  </MuiMetricCard>
</Grid>
 
 
      <Grid item xs={12} sm={6} lg={3}>
        <MuiMetricCard
         title={t("battery.title")}

          icon={<BatteryStdIcon />}
          iconColor="#374151"
          accent="#c2d3f5"
          sx={{ height: "100%" }}
        >
          <Box sx={{ textAlign: "center", py: 1 }}>
  <MetricValue
    value={`${latestTelemetry?.battery ?? "--"}`}
    unit="%"
    label={t("battery.level")}
    size={isMobile ? "medium" : "large"}
  />
 
  {latestTelemetry?.measuredAt && (
    <Typography variant="caption" color="text.secondary">
      Last measured: {formatMeasured(latestTelemetry.measuredAt)}
    </Typography>
  )}
</Box>
 
<Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
  <Chip
    label={(latestTelemetry?.battery || 0) > 20
  ? t("battery.good")
  : t("battery.low")}
    size="small"
    color={(latestTelemetry?.battery || 0) > 20 ? "success" : "warning"}
    sx={{ fontWeight: 600 }}
  />
</Box>
        </MuiMetricCard>
      </Grid>
 
      <Grid item xs={12} sm={6} lg={3}>
        <MuiMetricCard
        title={t("ecg.title")}
          icon={<FavoriteIcon />}
          iconColor="#ff7043"
          accent="#fff3e0"
          onClick={() => router.push("/dashboard/ecg")}
          sx={{ height: "100%" }}
        >
          <Box sx={{ textAlign: "center", py: 1 }}>
            <Typography
              variant={isMobile ? "h5" : "h5"}
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.dark,
                mb: 0.5,
              }}
            >
          {t("ecg.subtitle")}

            </Typography>
 
          
 
            {latestECGTime ? (
              <Typography variant="caption" color="text.secondary">
                {new Date(latestECGTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            ) : (
              <Typography variant="caption" color="text.secondary">
               {t("ecg.noRecord")}
              </Typography>
            )}
          </Box>
        </MuiMetricCard>
      </Grid>
 
      <Grid item xs={12} sm={6} lg={3}>
  <MuiMetricCard
    title={t("spo2.title")}
    icon={<OpacityIcon />}
    iconColor="#0284c7"
    accent="#e0f2fe"
   
    sx={{ height: "100%",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: 6,
  }, }}
  onClick={() => scrollToSection("spo2-section")}
  >
    <Box sx={{ textAlign: "center", py: 1 }}>
  <MetricValue
    value={latestSpO2 !== null ? `${latestSpO2}` : "--"}
    unit="%"
   label={t("spo2.current")}
    size={isMobile ? "medium" : "large"}
  />
 
  {spo2Points?.at(-1)?.ts && (
    <Typography variant="caption" color="text.secondary">
     {t("common.lastMeasured")} {formatMeasured(spo2Points.at(-1)!.ts)}
    </Typography>
  )}
</Box>
 
<Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
  <Chip
    label={spo2Status.label}
    size="small"
    color={spo2Status.color as any}
    sx={{ fontWeight: 600 }}
  />
</Box>
  </MuiMetricCard>
</Grid>
 
<Grid item xs={12} sm={6} lg={3}>
  <MuiMetricCard
   title={t("sleep.title")}
    icon={<BedtimeIcon />}
    iconColor="#1e40af"
    accent="#e0e7ff"
    loading={loadingSleep}
    sx={{ height: "100%",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: 6,
  }, }}
  onClick={() => scrollToSection("sleep-section")}
  >
   <Box sx={{ textAlign: "center", py: 1 }}>
  <MetricValue
    value={sleepHours1d !== null ? `${sleepHours1d}` : "--"}
    unit="hrs"
   label={t("sleep.duration")}
   
    size={isMobile ? "medium" : "large"}
  />
 
  {latestSleep && (
    <Typography variant="caption" color="text.secondary">
      Last measured:{" "}
      {formatMeasured(latestSleep.endTime ?? latestSleep.startTime)}
    </Typography>
  )}
</Box>
 
<Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
  <Chip
    label={
    sleepHours1d === null
  ? t("sleep.noData")
  : sleepHours1d >= 7
  ? t("sleep.good")
  : sleepHours1d >= 5
  ? t("sleep.moderate")
  : t("sleep.low")
    }
    size="small"
    color={
      sleepHours1d === null
        ? "default"
        : sleepHours1d >= 7
        ? "success"
        : sleepHours1d >= 5
        ? "warning"
        : "error"
    }
    sx={{ fontWeight: 600 }}
  />
</Box>
  </MuiMetricCard>
</Grid>
 
<Grid item xs={12} sm={6} lg={3}>
  <MuiMetricCard
   title={t("bp.title")}
    icon={<FavoriteIcon />}
    iconColor="#B91C1C"
    accent="#e3f8b1"
    loading={loadingBP}
    sx={{ height: "100%",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: 6,
  }, }}
  onClick={() => scrollToSection("bp-section")}
  >
    <Box sx={{ textAlign: "center", py: 1 }}>
  <MetricValue
    value={
      latestBP
        ? `${latestBP.systolic}/${latestBP.diastolic}`
        : "--"
    }
    unit="mmHg"
   label={t("bp.current")}
    size={isMobile ? "medium" : "large"}
  />
 
  {latestBP?.pulse !== undefined && (
    <Typography
      variant="body2"
      sx={{
      mt: 0.5,
      fontSize: isMobile ? "0.95rem" : "1rem",
      fontWeight: 700,                
      color: theme.palette.text.primary,
      lineHeight: 1.2,
    }}
    >
      {t("bp.pulse")} • {latestBP.pulse} bpm
    </Typography>
  )}
 
  {getBpMeasuredTime(latestBP) && (
    <Typography
      variant="caption"
      sx={{ display: "block", mt: 0.5 }}
      color="text.secondary"
    >
      Last measured:{" "}
      {formatMeasured(getBpMeasuredTime(latestBP))}
    </Typography>
  )}
</Box>
 
<Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
  <Chip
    label={
      latestBP
        ? getBPStatus(
            latestBP.systolic,
            latestBP.diastolic
          ).label
        : "No data"
    }
    color={
      latestBP
        ? getBPStatus(
            latestBP.systolic,
            latestBP.diastolic
          ).color
        : "default"
    }
    size="small"
    sx={{ fontWeight: 600 }}
  />
</Box>
  </MuiMetricCard>
</Grid>
 
<Grid item xs={12} sm={6} lg={3}>
  <MuiMetricCard
    title={t("glucose.title")}

    icon={<BloodtypeIcon />}
    iconColor="#dc2626"
    accent="#fee2e2"
   
    sx={{ height: "100%",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: 6,
  }, }}
  onClick={() => scrollToSection("glucose-section")}
  >
   <Box sx={{ textAlign: "center", py: 1 }}>
  <MetricValue
    value={stableGlucose ?? "--"}
    unit="mg/dL"
   label={t("glucose.last")}
    size={isMobile ? "medium" : "large"}
  />
 
  {stableGlucoseTs && (
    <Typography variant="caption" color="text.secondary">
      Last measured: {formatMeasured(stableGlucoseTs)}
    </Typography>
  )}
</Box>
 
<Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
  <Chip
    label={glucoseStatus.label}
    color={glucoseStatus.color}
    size="small"
    sx={{ fontWeight: 600 }}
  />
</Box>
  </MuiMetricCard>
</Grid>
 
 
<Grid item xs={12} sm={6} lg={3}>
  <MuiMetricCard
   title={t("temperature.title")}

    icon={<DeviceThermostatIcon />}
    iconColor="#ea580c"
    accent="#f5e0fc"
   
    sx={{ height: "100%",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: 6,
  }, }}
  onClick={() => scrollToSection("temperature-section")}
  >
    <Box sx={{ textAlign: "center", py: 1 }}>
  <MetricValue
    value={stableTemp ?? "--"}
    unit="°C"
  label={t("temperature.body")}
    size={isMobile ? "medium" : "large"}
  />
 
  {stableTempTs && (
    <Typography variant="caption" color="text.secondary">
      Last measured: {formatMeasured(stableTempTs)}
    </Typography>
  )}
</Box>
 
<Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
  <Chip
    label={
      latestTemp
        ? getTempStatus(latestTemp.value).label
        : "No data"
    }
    color={
      latestTemp
        ? getTempStatus(latestTemp.value).color
        : "default"
    }
    size="small"
    sx={{ fontWeight: 600 }}
  />
</Box>
  </MuiMetricCard>
</Grid>
 
<Grid item xs={12} sm={6} lg={3}>
  <MuiMetricCard
  title={t("stress.title")}

    icon={<SelfImprovementIcon />}
    iconColor="#7c3aed"
    accent="#e9d6c1"
    sx={{ height: "100%",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: 6,
  }, }}
  onClick={() => scrollToSection("stress-section")}
  >
   <Box sx={{ textAlign: "center", py: 1 }}>
  <MetricValue
    value={latestStress?.value ?? "--"}
    unit="/100"
   label={t("stress.level")}
    size={isMobile ? "medium" : "large"}
  />
 
  {latestStress?.ts && (
    <Typography variant="caption" color="text.secondary">
      Last measured: {formatMeasured(latestStress.ts)}
    </Typography>
  )}
</Box>
 
<Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
  <Chip
    label={stressStatus.label}
    color={stressStatus.color}
    size="small"
    sx={{ fontWeight: 600 }}
  />
</Box>
  </MuiMetricCard>
</Grid>
 
 
 
    </Grid>
  );
}
 
 
 