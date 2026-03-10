"use client";
 
import React from "react";
import Protected from "@/lib/api/protected";
import { useDashboard } from "@/hooks/useDashboard";
import { useDeviceDashboard } from "@/hooks/useDeviceDashboard";
 
import { useHeartRate } from "@/hooks/useHeartRate";
import { useSteps } from "@/hooks/useSteps";
import { useSpO2 } from "@/hooks/useSpo2";
import { useSleep } from "@/hooks/useSleep";
import { useStress } from "@/hooks/useStress";
import { useTemperature } from "@/hooks/useTemperature";
import { useBP } from "@/hooks/useBP";
import { useGlucose } from "@/hooks/useGlucose";
 
import { groupStepsByHour } from "@/lib/utils/stepsUtils";
 
import { Container, Stack, useTheme, useMediaQuery,  Fab, Zoom } from "@mui/material";
 
import DashboardNavbar from "./components/DashboardNavbar";
import DashboardHeaderCards from "./components/DashboardHeaderCards";
import DashboardAlerts from "./components/DashboardAlerts";
import DashboardMetricGrid from "./components/DashboardMetricGrid";
import HeartRateSection from "./components/HeartRateSection";
import StepsSection from "./components/StepsSection";
import SpO2Section from "./components/SpO2Section";
import SleepSection from "./components/SleepSection";
import BPSection from "../dashboard/components/BPSection";
import TemperatureSection from "./components/TemperatureSection";
import StressSection from "./components/StressSection";
import GlucoseSection from "./components/GlucoseSection";
import MovingBackground from "./MovingBackground";
import { useDoctors } from "@/hooks/useDoctors";
import { getLatestMeasurementTime } from "@/lib/utils/getLatestMeasurementTime";
 
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
 
 
 
 
export default function DashboardPage() {
  const {
    user,
    device,
    devices,
    latestTelemetry,
    dailySteps,
    avgHeartRate1h,
    latestECGTime,
    currentTime,
    currentDate,
   
    vitalAlerts,
    acknowledgeAlert,
    logout,
    refreshLiveData,
    setDevice,
  } = useDashboard();
 
 
 
  const [activeHeartDeviceId, setActiveHeartDeviceId] =
  React.useState<string>();
 
React.useEffect(() => {
  if (!device?.id) return;
  setActiveHeartDeviceId(device.id);
}, [device?.id]);
  const dashboardMetrics = useDeviceDashboard(device?.id);
 
  const [activeTempDeviceId, setActiveTempDeviceId] =
  React.useState<string>();const [activeStepsDeviceId, setActiveStepsDeviceId] =
  React.useState<string>();
 
React.useEffect(() => {
  if (!device?.id) return;
  setActiveStepsDeviceId(device.id);
}, [device?.id]);
 
 
 
React.useEffect(() => {
  if (!device?.id) return;
  setActiveTempDeviceId(device.id);
}, [device?.id]);
  /* ---------- DEVICE STATE ---------- */
 
  const [activeBpDeviceId, setActiveBpDeviceId] = React.useState<string>();
  const [activeStressDeviceId, setActiveStressDeviceId] = React.useState<string>();
  const [activeSleepDevice, setActiveSleepDevice] = React.useState<string>();
 
 
  React.useEffect(() => {
    if (!device?.id) return;
 
    setActiveBpDeviceId(device.id);
    setActiveStressDeviceId(device.id);
    setActiveSleepDevice(device.id);
  }, [device?.id]);
 
  /* ---------- HOOKS ---------- */
 
  const [activeGlucoseDeviceId, setActiveGlucoseDeviceId] =
  React.useState<string>();
 
React.useEffect(() => {
  if (!device?.id) return;
  setActiveGlucoseDeviceId(device.id);
}, [device?.id]);
 
 const {
  range,
  setRange,
  data,
  latest,
  criticalAlertTimes,
  alerts,
} = useHeartRate(activeHeartDeviceId, "1h");
  const loadingHeart = !data;
 
   const [activeSpO2DeviceId, setActiveSpO2DeviceId] =
  React.useState<string>();
 
React.useEffect(() => {
  if (!device?.id) return;
  setActiveSpO2DeviceId(device.id);
}, [device?.id]);
  const {
  rangeSpO2,
  setRangeSpO2,
  pointsspo2,
  loading,
  initialLoad,
  latestSpO2,
} = useSpO2(activeSpO2DeviceId, "1h");
const latestSpo2Time = latestSpO2?.ts ?? null;
 
 
 const {
  rangestep,
  setRangestep,
  points,
  totalSteps,
  loading: loadingSteps,
  initialLoad: initialStepsLoad,
  startTime,
  endTime,
    latestTs,
    minuteData,
 
} = useSteps(activeStepsDeviceId, "1h");
 
const {
  totalSteps: todaySteps
} = useSteps(activeStepsDeviceId, "1d");
 
 
 
  const hourlyData = groupStepsByHour(points);
 
  const weeklyData = React.useMemo(() => {
    const map = new Map<string, number>();
 
    points.forEach((p: any) => {
      const d = new Date(p.ts);
      const key = d.toDateString();
      map.set(key, (map.get(key) || 0) + (p.steps || 0));
    });
 
    const days: { day: string; steps: number }[] = [];
 
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
 
      const label = date.toLocaleDateString("en-US", {
        weekday: "short",
      });
 
      const key = date.toDateString();
 
      days.push({
        day: label,
        steps: map.get(key) || 0,
      });
    }
 
    return days;
  }, [points]);
 
  const maxHourly = Math.max(...hourlyData.map((d) => d.steps), 10);
  const maxWeekly = Math.max(...weeklyData.map((d) => d.steps), 10);
 
  const {
    rangeSleep,
    setRangeSleep,
    sleepSessions,
    latestSleep,
    loadingSleep,
  } = useSleep(activeSleepDevice);
 
  const {
    range: bpRange,
    setRange: setBpRange,
    points: bpPoints,
    latest: bpLatest,
    loadingBP,
    infoMessage,
  } = useBP(activeBpDeviceId, "1w");
 
  const {
    range: stressRange,
    setRange: setStressRange,
    points: stressPoints,
    latest: stressLatest,
    loading: loadingStress,
    infoMessage: stressInfoMessage,
  } = useStress(activeStressDeviceId, "1d");
 
 
  const { latest: latestGlucose } = useGlucose(activeGlucoseDeviceId, "1d");
 
 const { latestTemp, loadingTemp } =
  useTemperature(activeTempDeviceId, "1h");
 
  const { doctors, changeAccess, removeDoctor } = useDoctors();
 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
 
  const handleRefresh = async () => {
  await refreshLiveData();
};
 
  const currentDeviceName = device?.name ?? "Current Device";
 
 
 
 
// 1️⃣ calculate latest time
const latestMeasurementTime = React.useMemo(() => {
  return getLatestMeasurementTime(
    latestTelemetry?.measuredAt,
    latestECGTime,
 
    // heart rate
    latest?.ts,
 
    // steps
    latestTs,
 
    // bp
    bpLatest?.ts,
 
    // sleep
    latestSleep?.createdAt,
 
    // temperature
    latestTemp?.ts,
 
    // stress
    stressLatest?.ts,
 
    // glucose
    latestGlucose?.ts,
 
    // spo2
    latestSpO2?.ts,
 
    // fallback from chart arrays (important)
    points?.at(-1)?.ts,
    pointsspo2?.at(-1)?.ts,
    bpPoints?.at(-1)?.ts
  );
}, [
  latestTelemetry?.measuredAt,
  latestECGTime,
  latest?.ts,
  latestTs,
  bpLatest?.ts,
  latestSleep?.createdAt,
  latestTemp?.ts,
  stressLatest?.ts,
  latestGlucose?.ts,
  latestSpO2?.ts,
  points,
  pointsspo2,
  bpPoints
]);
 
// 2️⃣ state
const [displayMeasurementTime, setDisplayMeasurementTime] =
  React.useState<Date | null>(null);
 
React.useEffect(() => {
  setDisplayMeasurementTime(null);
}, [device?.id]);
 
// 3️⃣ effect
React.useEffect(() => {
  if (!latestMeasurementTime) return;
 
  setDisplayMeasurementTime((prev) => {
    if (!prev) return latestMeasurementTime;
    return latestMeasurementTime > prev ? latestMeasurementTime : prev;
  });
}, [latestMeasurementTime]);
 
const [showScrollTop, setShowScrollTop] = React.useState(false);
 
React.useEffect(() => {
  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 400); // show after scrolling
  };
 
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
 
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
 
  /* ---------- RENDER ---------- */
 
  return (
    <Protected>
      <MovingBackground />
 
      <DashboardNavbar
        user={user}
        vitalAlerts={vitalAlerts}
         devices={devices}
        currentDevice={device}
        setDevice={setDevice}
        logout={logout}
        handleRefresh={handleRefresh}
      />
 
      <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 3 }}>
        <DashboardHeaderCards
          currentTime={currentTime}
          currentDate={currentDate}
        unifiedMeasurementTime={displayMeasurementTime}
          doctors={doctors}
          onChangeAccess={changeAccess}
          onRemoveDoctor={removeDoctor}
        />
 
        <DashboardAlerts
          vitalAlerts={vitalAlerts}
          acknowledgeAlert={acknowledgeAlert}
          isMobile={isMobile}
        />
 
        <DashboardMetricGrid
          latestTelemetry={latestTelemetry}
          avgHeartRate1h={avgHeartRate1h}
          totalSteps={totalSteps}
 
          stepPoints={points}
          dailySteps={todaySteps}
          loadingHeart={loadingHeart}
          loadingSteps={loadingSteps}
          latestECGTime={latestECGTime}
          spo2Points={pointsspo2}
          loadingSpO2={loading}
          sleepSessions={sleepSessions}
          loadingSleep={loadingSleep}
          latestBP={bpLatest}
          loadingBP={loadingBP}
 
          latestGlucose={latestGlucose}
          latestTemp={latestTemp}
          loadingTemp={loadingTemp}
          latestStress={stressLatest}
          loadingStress={loadingStress}
        />
 
        <Stack spacing={3}>
      <HeartRateSection
  range={range}
  setRange={setRange}
  data={data}
  latest={latest}
  criticalAlertTimes={criticalAlertTimes}
  alerts={alerts}
  vitalAlerts={vitalAlerts}
  loadingHeart={loadingHeart}
 
  currentDeviceId={device?.id ?? ""}
  activeDeviceId={activeHeartDeviceId ?? ""}
  currentDeviceName={currentDeviceName}
  availableDevices={
    dashboardMetrics?.metrics?.heartRate?.availableOn ?? []
  }
  onSwitchDevice={setActiveHeartDeviceId}
/>
 
          <StepsSection
            rangestep={rangestep}
            setRangestep={setRangestep}
            totalSteps={totalSteps}
            loadingSteps={loadingSteps}
            startTime={startTime}
            endTime={endTime}
 
            minuteData={minuteData}
            hourlyData={hourlyData}
            weeklyData={weeklyData}
            maxHourly={maxHourly}
            maxWeekly={maxWeekly}
            handleRefresh={handleRefresh}
            latestTs={latestTs}
            currentDeviceId={device?.id ?? ""}
  activeDeviceId={activeStepsDeviceId ?? ""}
  currentDeviceName={currentDeviceName}
  availableDevices={
    dashboardMetrics?.metrics?.steps?.availableOn ?? []
  }
  onSwitchDevice={setActiveStepsDeviceId}
/>
         
 
 <SpO2Section
  rangeSpO2={rangeSpO2}
  setRangeSpO2={setRangeSpO2}
  pointsspo2={pointsspo2}
  loading={loading}
  initialLoad={initialLoad}
 latestSpO2={latestSpO2}
  currentDeviceId={device?.id ?? ""}
  activeDeviceId={activeSpO2DeviceId ?? ""}
  currentDeviceName={currentDeviceName}
  availableDevices={
    dashboardMetrics?.metrics?.spo2?.availableOn ?? []
  }
  onSwitchDevice={setActiveSpO2DeviceId}
/>
          <SleepSection
            rangeSleep={rangeSleep}
            setRangeSleep={setRangeSleep}
            sleepSessions={sleepSessions}
            latestSleep={latestSleep}
            loadingSleep={loadingSleep}
            currentDeviceId={device?.id ?? ""}
            activeDeviceId={activeSleepDevice ?? ""}
            currentDeviceName={currentDeviceName}
            availableDevices={
              dashboardMetrics?.metrics?.sleep?.availableOn ?? []
            }
            onSwitchDevice={setActiveSleepDevice}
          />
 
          <BPSection
            range={bpRange}
            setRange={setBpRange}
            points={bpPoints}
            latest={bpLatest}
            loadingBP={loadingBP}
            infoMessage={infoMessage}
            currentDeviceId={device?.id ?? ""}
            activeDeviceId={activeBpDeviceId ?? ""}
            currentDeviceName={currentDeviceName}
            availableDevices={
              dashboardMetrics?.metrics?.bloodPressure?.availableOn ?? []
            }
            onSwitchDevice={setActiveBpDeviceId}
          />
 
          <GlucoseSection
  currentDeviceId={device?.id ?? ""}
  activeDeviceId={activeGlucoseDeviceId ?? ""}
  currentDeviceName={currentDeviceName}
  availableDevices={
    dashboardMetrics?.metrics?.glucose?.availableOn ?? []
  }
  onSwitchDevice={setActiveGlucoseDeviceId}
/>
 
        <TemperatureSection
  currentDeviceId={device?.id ?? ""}
  activeDeviceId={activeTempDeviceId ?? ""}
  currentDeviceName={currentDeviceName}
  availableDevices={
    dashboardMetrics?.metrics?.temperature?.availableOn ?? []
  }
  onSwitchDevice={setActiveTempDeviceId}
/>
 
          <StressSection
            range={stressRange}
            setRange={setStressRange}
            points={stressPoints}
            latest={stressLatest}
            loading={loadingStress}
            infoMessage={stressInfoMessage}
            currentDeviceId={device?.id ?? ""}
            activeDeviceId={activeStressDeviceId ?? ""}
            currentDeviceName={currentDeviceName}
            availableDevices={
              dashboardMetrics?.metrics?.stress?.availableOn ?? []
            }
            onSwitchDevice={setActiveStressDeviceId}
          />
 
         
        </Stack>
      </Container>
      <Zoom in={showScrollTop}>
  <Fab
    onClick={scrollToTop}
    color="primary"
    size="medium"
    sx={{
      position: "fixed",
      bottom: 24,
      right: 24,
      zIndex: 9999,
    }}
  >
    <KeyboardArrowUpIcon />
  </Fab>
</Zoom>
    </Protected>
  );
}
 
 
 