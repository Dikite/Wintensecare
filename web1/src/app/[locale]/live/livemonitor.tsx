"use client";
import { useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
 import { useTranslations } from "next-intl";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
  XAxis,
} from "recharts";
 
import { useEffect, useState } from "react";
import { useLiveDevices } from "@/hooks/uselivedevices";
import { useECGSocket } from "@/hooks/useECGSocket";
import { useTrendBuffer } from "@/hooks/useTrendBuffer";
import { getVitalSeverity } from "@/lib/utils/vitalAlerts";
 
/* ============================================================
   CONFIG
============================================================ */
 
const FIVE_MIN = 5 * 60 * 1000;
 
const isFresh = (ts?: string | null) =>
  ts && Date.now() - new Date(ts).getTime() < FIVE_MIN;
 
const COLORS = {
  hr: "#00FF9C",
  spo2: "#3DA5FF",
  bp: "#FF9F1C",
  temp: "#FF4D4D",
  stress: "#A78BFA",
};
 
type ChartPoint = {
  t: number;
  v: number;
};
 
/* ============================================================
   MAIN
============================================================ */
 
export default function LiveMonitor() {
 
 
  const devices = useLiveDevices();
 
  const [selected, setSelected] =
    useState<Record<string, string | null>>({});
 
 
 
const ecgDevice =
  selected["ecg"] ??
  devices[0]?.deviceId ??
  null;
 
const { points: ecgPoints } =
  useECGSocket(ecgDevice);
 
const activeECGDevices = devices;
const t = useTranslations("liveMonitor");
 
  return (
    <Box sx={{ bgcolor: "#0B0F1A",p: 2, color: "#fff" }}>
     <Typography sx={{ fontSize: 14, mb: 2, color: "#94A3B8" }}>
  {t("title")}
</Typography>
 
      <Grid container spacing={2}>
        {/* LEFT */}
        <Grid item xs={8}>
          <Stack spacing={2}>
          <Panel
  title={t("ecg")}

  color="#00FF9C"
  right={
  <HeaderSelector
  devices={activeECGDevices}
  selectedId={ecgDevice}
  metric="ecg"
  setSelected={setSelected}
/>
  }
>
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={ecgPoints}>
                  <CartesianGrid stroke="#1E2434" strokeDasharray="3 3" />
                  <YAxis domain={[-2, 2]} hide />
                  <Line
                   type="monotone"
                    dataKey="v"
                    stroke="#00FF9C"
                    strokeWidth={2}
                    dot={false}
                   
                    isAnimationActive={false}
                  />
 
                </LineChart>
              </ResponsiveContainer>
            </Panel>
 
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <MetricTrend
                 label={t("heartRate")}
                  metric="heartRate"
                  atKey="heartRateAt"
                  unit="bpm"
                  color={COLORS.hr}
                 
                 
                  devices={devices}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Grid>
 
              <Grid item xs={6}>
                <MetricTrend
                 label={t("spo2")}
                  metric="spo2"
                  atKey="spo2At"
                  unit="%"
                  color={COLORS.spo2}
                  devices={devices}
                 
                  selected={selected}
                  setSelected={setSelected}
                />
              </Grid>
 
              <Grid item xs={6}>
                <BloodPressureTrend
                  devices={devices}
                  selected={selected}
                 
                  setSelected={setSelected}
                />
              </Grid>
 
              <Grid item xs={6}>
                <MetricTrend
               label={t("temperature")}
                  metric="temperature"
                  atKey="temperatureAt"
                  unit="°C"
                 
                  color={COLORS.temp}
                  devices={devices}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Grid>
 
              <Grid item xs={12}>
                <MetricTrend
                label={t("stress")}
                  metric="stress"
                  atKey="stressAt"
                  unit="%"
                  color={COLORS.stress}
                 
                  devices={devices}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Grid>
            </Grid>
          </Stack>
        </Grid>
 
        {/* RIGHT */}
        <Grid item xs={4}>
          <Stack spacing={2}>
            <MetricCard {...cardProps(t("heartRate"),"heartRate","heartRateAt","bpm",COLORS.hr,devices,selected,setSelected)} />
            <MetricCard {...cardProps(t("oxygen"),"spo2","spo2At","%",COLORS.spo2,devices,selected,setSelected)} />
            <BloodPressureCard devices={devices} selected={selected} setSelected={setSelected}/>
            <MetricCard {...cardProps(t("temperature"),"temperature","temperatureAt","°C",COLORS.temp,devices,selected,setSelected)} />
            <MetricCard {...cardProps(t("stress"),"stress","stressAt","%",COLORS.stress,devices,selected,setSelected)} />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
 
/* ============================================================
   PANEL (FIXED HEADER ALIGNMENT)
============================================================ */
 
function Panel({ title, color, children, right }: any) {
  const t = useTranslations("liveMonitor");
  return (
    <Paper sx={{ p: 0.7, bgcolor: "#0F1322", border: "1px solid #1E2434" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography sx={{ fontSize: 12, color, fontWeight: 600 }}>
          {title}
        </Typography>
 
        {right}
      </Box>
 
      {children}
    </Paper>
  );
}
 
/* ============================================================
   METRIC TREND
============================================================ */
 
function MetricTrend({
  
  label,
  metric,
  atKey,
  unit,
  color,
  devices,
  selected,
   
  setSelected,
}: any) {
 
const availableDevices = devices;
 
const activeDevices = devices.filter(
  (d: any) => d[metric] !== null && isFresh(d[atKey])
);
 
const selectedId =
  selected[metric] ??
  activeDevices[0]?.deviceId ??
  null;
 
const device = availableDevices.find(
  (d: any) => d.deviceId === selectedId
);
  const value = device?.[metric] ?? null;
 
const trendData = useTrendBuffer(value, selectedId);
 const t = useTranslations("liveMonitor");
  return (
    <Panel
      title={label}
      color={color}
    right={
<HeaderSelector
  devices={activeDevices}
    selectedId={selectedId}
    metric={metric}
    setSelected={setSelected}
  />
 
      }
    >
      <Typography sx={{ fontWeight: 700, color }}>
        {value ?? "--"} {value && unit}
      </Typography>
 
      <ResponsiveContainer width="100%" height={60}>
        <LineChart data={trendData}>
          <CartesianGrid stroke="#1E2434" horizontal={false} />
         
          <YAxis hide />
          <Line
           type="monotone"
  dataKey="v"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Panel>
  );
}
 
/* ============================================================
   BP TREND
============================================================ */
 
function BloodPressureTrend({ devices, selected, setSelected }: any){
 const t = useTranslations("liveMonitor");
  const active = devices.filter(
    (d: any) =>
      d.systolic !== null &&
      d.diastolic !== null &&
      isFresh(d.bpAt)
  );
 
const selectedId =
  selected["bp"] ??
  active[0]?.deviceId ??
  devices[0]?.deviceId ??
  null;
 
  const d = active.find((x: any) => x.deviceId === selectedId);
 
const trendData = useTrendBuffer(
  d?.systolic ?? null,
  selectedId
);
 
  return (
    <Panel
      title={t("bloodPressure")}
      color={COLORS.bp}
      right={
<HeaderSelector
  devices={active}
  selectedId={selectedId}
  metric="bp"
  setSelected={setSelected}
/>
      }
    >
      <Typography sx={{ fontWeight: 700, color: COLORS.bp }}>
        {d ? `${d.systolic}/${d.diastolic}` : "--"} mmHg
      </Typography>
 
      <ResponsiveContainer width="100%" height={60}>
        <LineChart data={trendData}>
          <CartesianGrid stroke="#1E2434" horizontal={false} />
     
          <YAxis hide />
          <Line
           type="monotone"
            dataKey="v"
            stroke={COLORS.bp}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Panel>
  );
}
 
/* ============================================================
   METRIC CARD
============================================================ */
 
function MetricCard(props: any) {
  const t = useTranslations("liveMonitor");
  const { label, metric, atKey, unit, color, devices, selected, setSelected } =
    props;
 
  const active = useMemo(
    () =>
      devices.filter(
        (d: any) => d[metric] !== null && isFresh(d[atKey])
      ),
    [devices, metric, atKey]
  );
 
  const activeDevices = active;
  const selectedId =
    selected[metric] || active[0]?.deviceId || null;
 
  const device = active.find((d: any) => d.deviceId === selectedId);
  const value = device?.[metric];
 
  const severity =
    value == null ? "normal" : getVitalSeverity(metric, value);
 
  const severityColor =
    severity === "critical"
      ? "#FF3B30"
      : severity === "warning"
      ? "#FFD60A"
      : "#94A3B8";
 
  return (
    <Paper sx={{ p: 0.9, bgcolor: "#0F1322", border: `1px solid ${color}` }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography sx={{ fontSize: 12, color: "#FFFFFF" }}>
  {label}
</Typography>
 
     <HeaderSelector
  devices={activeDevices}
  selectedId={selectedId}
  metric={metric}
  setSelected={setSelected}
/>
      </Box>
 
      <Typography sx={{ fontSize: 30, fontWeight: 700, color, lineHeight: 1 }}>
        {value ?? "--"}
      </Typography>
 
      {value && (
        <Typography sx={{ fontSize: 12, color: severityColor }}>
          {unit}
        </Typography>
      )}
    </Paper>
  );
}
 
/* ============================================================
   BP CARD
============================================================ */
 
function BloodPressureCard({ devices, selected, setSelected }: any) {
  const t = useTranslations("liveMonitor");
  const active = devices.filter(
    (d: any) =>
      d.systolic !== null &&
      d.diastolic !== null &&
      isFresh(d.bpAt)
  );
 
  const selectedId =
    selected["bp"] || active[0]?.deviceId || null;
 
  const d = active.find((x: any) => x.deviceId === selectedId);
 
  const value = d ? `${d.systolic}/${d.diastolic}` : null;
 
  return (
   <Paper sx={{ p: 0.9, bgcolor: "#0F1322", border: `1px solid ${COLORS.bp}` }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography sx={{ fontSize: 12, color: "#FFFFFF" }}>
  BLOOD PRESSURE
</Typography>
 
<HeaderSelector
  devices={active}
  selectedId={selectedId}
  metric="bp"
  setSelected={setSelected}
/>
      </Box>
 
    <Typography
  sx={{
    fontSize: 28,
    fontWeight: 700,
    color: COLORS.bp,
    lineHeight: 1,
  }}
>
        {value ?? "--"}
      </Typography>
 
      {value && <Typography sx={{ fontSize: 12 }}>mmHg</Typography>}
    </Paper>
  );
}
 
/* ============================================================
   SELECTOR
============================================================ */
 
function HeaderSelector({ devices, selectedId, metric, setSelected }: any) {
 const t = useTranslations("liveMonitor");
  // 🚫 no active devices
  if (devices.length === 0) return null;
 
  // ✅ single active device → show text only
  if (devices.length === 1) {
    return (
      <Typography sx={{ fontSize: 11, color: "#94A3B8" }}>
        {devices[0].deviceName}
      </Typography>
    );
  }
 
  // ✅ multiple devices → dropdown
  return (
    <Select
      size="small"
      value={selectedId || ""}
      onChange={(e) =>
        setSelected((prev: any) => ({
          ...prev,
          [metric]: e.target.value,
        }))
      }
      sx={{
        height: 24,
        fontSize: 11,
        bgcolor: "#0B0F1A",
        "& .MuiSelect-select": { color: "#FFFFFF" },
        "& .MuiSvgIcon-root": { color: "#FFFFFF" },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#1E2434",
        },
      }}
    >
      {devices.map((d: any) => (
        <MenuItem key={d.deviceId} value={d.deviceId}>
          {d.deviceName}
        </MenuItem>
      ))}
    </Select>
  );
}
 
/* ============================================================
   HELPERS
============================================================ */
 
const cardProps = (
  label: string,
  metric: string,
  atKey: string,
  unit: string,
  color: string,
  devices: any,
  selected: any,
  setSelected: any
) => ({
  label,
  metric,
  atKey,
  unit,
  color,
  devices,
  selected,
  setSelected,
});
 
 
 