"use client";
 
import React, { useMemo } from "react";
import {
  Paper,
  Box,
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  useMediaQuery,
  alpha,
  Skeleton,
  Chip,
} from "@mui/material";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import SpO2Chart from "../../components/SpO2Chart";
import type { SpO2Point, SpO2Range } from "@/types/spo2";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useTranslations } from "next-intl";
 
 
type DeviceOption = {
  id: string;
  name: string;
  type: string;
};
 
type Props = {
  rangeSpO2: SpO2Range;
  setRangeSpO2: (v: SpO2Range) => void;
  pointsspo2: SpO2Point[];
  loading: boolean;
  initialLoad: boolean;
  latestSpO2: SpO2Point | null;
  currentDeviceId: string;
  activeDeviceId: string;
  currentDeviceName: string;
  availableDevices?: DeviceOption[];
  onSwitchDevice: (id: string) => void;
};
 
 
function formatDate(ts: string) {
  const d = new Date(ts);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
 
 
function getSpO2Status(
  value: number | null,
  t: any
): { label: string; color: "default" | "success" | "warning" | "error" } {
 
  if (value === null) return { label: t("noData"), color: "default" };
 
  if (value >= 95) return { label: t("normal"), color: "success" };
  if (value >= 90) return { label: t("low"), color: "warning" };
 
  return { label: t("critical"), color: "error" };
}
 
function formatTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
 
 
function getCurrentSpO2(points: SpO2Point[]) {
  if (!points?.length) return null;
 
  const latest = points
    .slice()
    .sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime())
    .at(-1);
 
  if (!latest) return null;
 
  const v =
    latest.avg !== undefined && latest.avg !== null
      ? Number(latest.avg)
      : Number(latest.max ?? latest.min);
 
  return Number.isFinite(v) ? v : null;
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
 
 
export default function SpO2Section({
  rangeSpO2,
  setRangeSpO2,
  pointsspo2,
  loading,
  initialLoad,
 latestSpO2,
  currentDeviceId,
  activeDeviceId,
  currentDeviceName,
  availableDevices = [],
  onSwitchDevice,
}: Props){
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
 const t = useTranslations("spo2");
 
 
 const filteredPoints = pointsspo2;
 
const { low, high, current } = useMemo(() => {
  if (!pointsspo2?.length) {
    return { low: null, high: null, current: null };
  }
 
  let lo = Infinity;
  let hi = -Infinity;
 
  for (const p of pointsspo2) {
    if (p.min != null) lo = Math.min(lo, p.min);
    if (p.max != null) hi = Math.max(hi, p.max);
  }
 
  return {
    low: lo === Infinity ? null : lo,
    high: hi === -Infinity ? null : hi,
    current: getCurrentSpO2(pointsspo2),
  };
}, [pointsspo2]);
 
 
const lastMeasurement = latestSpO2?.ts ?? null;
 
const status = useMemo(() => getSpO2Status(current, t), [current, t]);
 
  const dateRangeLabel = useMemo(() => {
  if (!pointsspo2?.length) return "--/--/---- - --/--/----";
 
  const sorted = [...pointsspo2].sort(
  (a, b) => Date.parse(a.ts) - Date.parse(b.ts)
);
 
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
 
  return `${formatDate(first.ts)} - ${formatDate(last.ts)}`;
}, [pointsspo2]);
 
  const ranges: SpO2Range[] = ["30m", "1h", "8h", "1d", "7d"];
 
  return (
    <Paper
     id="spo2-section"
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
    <Box
  sx={{
    px: { xs: 2, md: 2.5 },
    pt: { xs: 2, md: 2.5 },
    pb: 1.5,
    background: `linear-gradient(135deg,
      ${alpha(theme.palette.info.main, 0.08)} 0%,
      ${alpha(theme.palette.primary.main, 0.04)} 45%,
      ${alpha(theme.palette.success.main, 0.03)} 100%)`,
  }}
>
  <Stack
    direction={{ xs: "column", md: "row" }}
    alignItems={{ xs: "flex-start", md: "center" }}
    justifyContent="space-between"
    spacing={2}
  >
 
    {/* LEFT: ICON + TITLE */}
    <Stack direction="row" spacing={1.2} alignItems="center">
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: 3,
          display: "grid",
          placeItems: "center",
          bgcolor: alpha(theme.palette.info.main, 0.12),
          color: theme.palette.info.main,
        }}
      >
        <WaterDropOutlinedIcon />
      </Box>
 
      <Box>
        <Typography fontWeight={900}>SpO₂</Typography>
        <Typography fontSize={12} color="text.secondary">
         {t("subtitle")}
        </Typography>
      </Box>
    </Stack>
 
    {/* RIGHT: RANGE + DEVICES */}
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      flexWrap="wrap"
      justifyContent={{ xs: "flex-start", md: "flex-end" }}
    >
 
     {/* RANGE FILTER */}
<ToggleButtonGroup
  value={rangeSpO2}
  exclusive
  onChange={(_, v) => v && setRangeSpO2(v)}
  size={isMobile ? "small" : "medium"}
  sx={{
    "& .MuiToggleButton-root": {
      px: isMobile ? 1.5 : 2,
      py: 0.5,
      borderRadius: 2,
      borderColor: alpha(theme.palette.primary.main, 0.2),
      "&.Mui-selected": {
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: "white",
      },
    },
  }}
>
  {ranges.map((r) => (
    <ToggleButton key={r} value={r}>
      {r === "7d" ? "1W" : r.toUpperCase()}
    </ToggleButton>
  ))}
</ToggleButtonGroup>
 
      {/* DEVICE SWITCH */}
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
  </Stack>
 
  {/* STATS ROW */}
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="flex-end"
    sx={{ mt: 2 }}
  >
</Stack>
{/* LOWEST / CURRENT / HIGHEST */}
<Stack
  direction="row"
  justifyContent="space-between"
  alignItems="flex-end"
  sx={{ mt: 2 }}
>
  {/* Lowest */}
  <Box>
    <Typography fontSize={12} color="text.secondary">
   {t("lowest")}
    </Typography>
 
    {loading ? (
      <Skeleton width={70} height={38} />
    ) : (
      <Typography fontWeight={900} sx={{ fontSize: 40, lineHeight: 1 }}>
        {low !== null ? low : "--"}
        <Typography component="span" sx={{ fontSize: 16, ml: 0.6, color: "text.secondary" }}>
          %
        </Typography>
      </Typography>
    )}
  </Box>
 
  {/* Current */}
  {/* Current */}
<Box sx={{ textAlign: "center" }}>
  <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
    <Typography fontSize={12} color="text.secondary">
     {t("current")}
    </Typography>
 
    {!loading && (
      <Chip
        size="small"
        label={status.label}
        color={status.color}
        sx={{ fontWeight: 800 }}
      />
    )}
  </Stack>
 
  {loading ? (
    <Skeleton width={70} height={38} />
  ) : (
    <Typography fontWeight={900} sx={{ fontSize: 40, lineHeight: 1 }}>
      {current !== null ? current : "--"}
      <Typography component="span" sx={{ fontSize: 16, ml: 0.6, color: "text.secondary" }}>
        %
      </Typography>
    </Typography>
  )}
 
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    px: 2,
    py: 0.8,
    mt: 1,
    borderRadius: 2,
    background: alpha(theme.palette.primary.main, 0.05),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
  }}
>
  <AccessTimeIcon
    sx={{ fontSize: 16, color: theme.palette.primary.main }}
  />
 
  <Typography fontSize={12} fontWeight={600}>
   {loading ? (
  <Skeleton width={150} />
) : lastMeasurement ? (
  formatDateTime(lastMeasurement)
) : (
 t("noData")
)}
  </Typography>
</Box>
</Box>
 
 
  {/* Highest */}
  <Box sx={{ textAlign: "right" }}>
    <Typography fontSize={12} color="text.secondary">
     {t("highest")}
    </Typography>
 
    {loading ? (
      <Skeleton width={70} height={38} />
    ) : (
      <Typography fontWeight={900} sx={{ fontSize: 40, lineHeight: 1 }}>
        {high !== null ? high : "--"}
        <Typography component="span" sx={{ fontSize: 16, ml: 0.6, color: "text.secondary" }}>
          %
        </Typography>
      </Typography>
    )}
  </Box>
</Stack>
 
        {/* DATE RANGE */}
        <Typography fontSize={13} color="text.secondary" sx={{ mt: 0.8 }}>
          {loading ? <Skeleton width={180} /> : dateRangeLabel}
        </Typography>
      </Box>
 
      {/* CHART */}
      <Box sx={{ px: { xs: 2, md: 2.5 }, py: 2 }}>
        <Box
          sx={{
            height: 280,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: alpha(theme.palette.primary.main, 0.02),
            p: 1.2,
          }}
        >
         <SpO2Chart pointsspo2={pointsspo2} loading={initialLoad && loading} range={rangeSpO2} />
 
{loading && !initialLoad && (
  <Box sx={{ position: "absolute", top: 8, right: 8 }}>
    <Skeleton width={20} height={20} />
  </Box>
)}
        </Box>
 
        <Typography fontSize={12} color="text.secondary" sx={{ mt: 1 }}>
          {t("chartHint")}
        </Typography>
      </Box>
    </Paper>
  );
}
 
 
 
 
 