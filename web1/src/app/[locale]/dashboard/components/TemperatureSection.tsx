"use client";
 
import {
  Paper,
  Typography,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Chip,
  Grid,
  alpha,
  useTheme,
  useMediaQuery,
  CircularProgress
} from "@mui/material";
 
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import { useTemperature } from "@/hooks/useTemperature";
import TemperatureChart from "../../components/TemperatureChart";
import { getTemperatureStatus } from "@/lib/utils/temperatureUtils";
import TemperatureThermometer from "../../components/TemperatureThermometer";
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
 
export default function TemperatureSection({
  currentDeviceId,
  activeDeviceId,
  currentDeviceName,
  availableDevices = [],
  onSwitchDevice,
}: Props) {
 
  const theme = useTheme();
const t = useTranslations("temperature");
 
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
 
  const {
    rangeTemp,
    setRangeTemp,
    points,
    latestTemp,
    loadingTemp,
    initialLoad
  } = useTemperature(activeDeviceId, "1h");
 
  const value = latestTemp?.value;
  const status = getTemperatureStatus(value);
 
  return (
    <Paper
    id="temperature-section"
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
                background: `linear-gradient(135deg,#EF5350,#E53935)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <DeviceThermostatIcon fontSize="small" />
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
  {/* Row: Current + Toggle + Devices */}
  <Stack
  direction="row"
  spacing={2}
  flexWrap="nowrap"
  justifyContent={{ xs: "flex-start", md: "flex-end" }}
  alignItems="center"
  sx={{ width: "100%", overflowX: "auto" }}
>
 
            <Typography variant="h6" fontWeight={550}>
  <Box component="span" color="text.secondary">
    {t("currentTemperature")} :
  </Box>{" "}
  {value ? `${value.toFixed(1)} °C` : "--"}
</Typography>
 
           <ToggleButtonGroup
  value={rangeTemp}
  exclusive
  onChange={(_, v) => v && setRangeTemp(v)}
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
 
            <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
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
    background: alpha(theme.palette.error.main, 0.05),
    border: `1px solid ${alpha(theme.palette.error.main, 0.15)}`,
  }}
>
  <Typography variant="body2" sx={{ fontWeight: 600 }}>
     
    {latestTemp?.measuredAt
      ? formatDateTime(latestTemp.measuredAt)
      : t("noData")}
  </Typography>
</Box>
 
          </Stack>
        </Grid>
      </Grid>
 
      {/* CONTENT */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
         
          {/* keep chart mounted always */}
          <Box position="relative">
            <TemperatureChart points={points} rangeTemp={rangeTemp} />
 
            {/* small spinner only */}
            {loadingTemp && !initialLoad && (
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                }}
              >
                <CircularProgress size={18} />
              </Box>
            )}
 
            {/* big spinner only first load */}
            {initialLoad && loadingTemp && (
              <Stack alignItems="center" py={4}>
                <CircularProgress />
              </Stack>
            )}
 
          </Box>
 
        </Grid>
 
       <Grid item xs={12} md={4} display="flex" justifyContent="center">
  <TemperatureThermometer value={value} />
</Grid>
      </Grid>
    </Paper>
  );
}
 
 