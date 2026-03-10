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
  Button,
  useTheme,
  useMediaQuery,
  alpha,
  Chip,
} from "@mui/material";
import { useTranslations } from "next-intl";
 
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RefreshIcon from "@mui/icons-material/Refresh";
 
import StepsDial from "../../components/StepsDial";
import StepsChart from "../../components/StepsChart";
import { ranges as rangeOptionssteps } from "@/types/steps";


 
type RangeType = "30m" | "1h" | "8h" | "1d" | "7d";
 
type DeviceOption = {
  id: string;
  name: string;
  type: string;
};
 
type Props = {
  rangestep: RangeType;
  setRangestep: React.Dispatch<React.SetStateAction<RangeType>>;
  totalSteps: number;
  loadingSteps: boolean;
  startTime: string | null;
  endTime: string | null;
  hourlyData: any[];
  weeklyData: any[];
  maxHourly: number;
  maxWeekly: number;

  latestTs: string | null;

  minuteData: any[];
 
  currentDeviceId: string;
  activeDeviceId: string;
  currentDeviceName: string;
  availableDevices?: DeviceOption[];
  onSwitchDevice: (id: string) => void;
 
  handleRefresh: () => void;
};
 
export default function StepsSection({
  rangestep,
  setRangestep,
  totalSteps,
  startTime,
  endTime,
  hourlyData,
  weeklyData,
  maxHourly,
  maxWeekly,
latestTs,

 minuteData,  
  currentDeviceId,
  activeDeviceId,
  currentDeviceName,
  availableDevices = [],
  onSwitchDevice,
  handleRefresh,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
const t = useTranslations("steps");
  

 
  return (
    <Paper
      id="steps-section"
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: theme.palette.background.paper,
        boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
      }}
    >
      {/* HEADER */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        {/* LEFT SIDE */}
        <Grid item xs={12} md={6}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <DirectionsWalkIcon fontSize="small" />
            </Box>
 
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
               {t("title")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
               {t("subtitle")}
              </Typography>
            </Box>
          </Stack>
        </Grid>
 
        {/* RIGHT SIDE */}
        <Grid item xs={12} md={6}>
         <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: { xs: "flex-start", md: "flex-end" },
    gap: 1.5,
  }}
>

  {/* RANGE + DEVICE ROW */}
  <Stack
    direction="row"
    spacing={1.5}
    alignItems="center"
    flexWrap="wrap"
    justifyContent={{ xs: "flex-start", md: "flex-end" }}
  >
            {/* RANGE FILTER */}
            <ToggleButtonGroup
              value={rangestep}
              exclusive
              onChange={(_, v) => v && setRangestep(v)}
              size={isMobile ? "small" : "medium"}
              sx={{
                "& .MuiToggleButton-root": {
                  px: isMobile ? 1.5 : 2,
                  py: 0.5,
                  borderRadius: 2,
                  borderColor: alpha(theme.palette.success.main, 0.2),
                  "&.Mui-selected": {
                    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                    color: "white",
                  },
                },
              }}
            >
              {rangeOptionssteps.map((r) => (
                <ToggleButton
                  key={r.value}
                  value={r.value}
                  sx={{
                    px: isMobile ? 1 : 1.5,
                    fontSize: isMobile ? 12 : 14,
                  }}
                >
                  {r.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
 
            {/* DEVICE SWITCH */}
            <Stack direction="row" spacing={1}>
              <Chip
                label={currentDeviceName}
                color={
                  activeDeviceId === currentDeviceId
                    ? "success"
                    : "default"
                }
                variant={
                  activeDeviceId === currentDeviceId
                    ? "filled"
                    : "outlined"
                }
                onClick={() => onSwitchDevice(currentDeviceId)}
                size="small"
              />
 
              {availableDevices.map((d) => (
                <Chip
                  key={d.id}
                  label={d.name}
                  color={
                    activeDeviceId === d.id ? "success" : "default"
                  }
                  variant={
                    activeDeviceId === d.id ? "filled" : "outlined"
                  }
                  onClick={() => onSwitchDevice(d.id)}
                  size="small"
                />
              ))}
            </Stack>

            </Stack>
{/* LAST MEASUREMENT */}
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
  <AccessTimeIcon
    sx={{ fontSize: 16, color: theme.palette.primary.main }}
  />

  <Typography variant="body2" sx={{ fontWeight: 600 }}>
  {latestTs
    ? new Date(latestTs).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : t("noData")}
</Typography>
</Box>

          </Box>
        </Grid>
      </Grid>
 
      {/* CONTENT */}
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Box sx={{ width: "100%", height: "100%", minHeight: 380 }}>
            <StepsDial
              totalSteps={totalSteps}
              startTime={startTime}
              endTime={endTime}
              size={isMobile ? 200 : 240}
            />
          </Box>
        </Grid>
 
        <Grid item xs={12} md={6}>
          <Box sx={{ width: "100%", height: "100%", minHeight: 380 }}>
            <StepsChart
            minuteData={minuteData}
              hourlyData={hourlyData}
              weeklyData={weeklyData}
              maxHourly={maxHourly}
              maxWeekly={maxWeekly}
              range={rangestep}
            />
          </Box>
        </Grid>
      </Grid>
 
      {/* FOOTER */}
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <AccessTimeIcon sx={{ fontSize: 14 }} />
        {t("autoUpdate")}
        </Typography>
 
        <Button
          size="small"
          variant="outlined"
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
        >
          {t("refresh")}
        </Button>
      </Box>
    </Paper>
  );
}
 