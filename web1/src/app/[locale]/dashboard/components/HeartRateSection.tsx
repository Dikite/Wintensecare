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
  Badge,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HeartChart from "../../components/HeartChart";
import { useTranslations } from "next-intl";
import { ranges as rangeOptions , TelemetryPoint, TelemetryResponse } from "@/types/heart";
 
type RangeType = "30m" | "1h" | "8h" | "1d" | "7d";
 
type DeviceOption = {
  id: string;
  name: string;
  type: string;
};
type Props = {
  range: RangeType;
  setRange: React.Dispatch<React.SetStateAction<RangeType>>;
  data: TelemetryResponse | null;
  latest: TelemetryPoint;
  criticalAlertTimes:  number[];
  alerts: any[];
  vitalAlerts: any[];
  loadingHeart: boolean;
  currentDeviceId: string;
activeDeviceId: string;
currentDeviceName: string;
availableDevices?: DeviceOption[];
onSwitchDevice: (id: string) => void;
};
 
 
export default function HeartRateSection({

  range,
  setRange,
  data,
  latest,
  criticalAlertTimes,
  alerts,
  vitalAlerts,
  loadingHeart,
 
  currentDeviceId,
  activeDeviceId,
  currentDeviceName,
  availableDevices = [],
  onSwitchDevice,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const t = useTranslations("heartRate");
 
  const getHeartRateStatus = (rate?: number) => {
    if (!rate) return "default";
    if (rate >= 100) return "error";
    if (rate >= 90) return "warning";
    if (rate >= 60 && rate <= 89) return "success";
    return "info";
  };
 
  return (
    <Paper
     id="heart-section"  
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 3,
        mb: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: theme.palette.background.paper,
        boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
      }}
    >
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
  {/* LEFT SIDE */}
  <Grid item xs={12} md={4}>
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.error.light} 0%, ${theme.palette.error.main} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <FavoriteIcon fontSize="small" />
      </Box>
 
      <Box>
       <Typography variant="h6" fontWeight={700}>
  {t("title")}
</Typography>
        <Typography variant="body2" color="text.secondary">
  {t("subtitle")}
</Typography>
      </Box>
 
      {alerts?.some(a => a.severity === "CRITICAL") && (
        <Badge color="error" badgeContent={vitalAlerts.length}>
          <WarningAmberIcon color="action" />
        </Badge>
      )}
    </Stack>
  </Grid>
 
  {/* RIGHT SIDE */}
  <Grid item xs={12} md={8}>
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="flex-end"
      flexWrap="wrap"
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
            borderColor: alpha(theme.palette.primary.main, 0.2),
            "&.Mui-selected": {
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "white",
            },
          },
        }}
      >
        {rangeOptions.map(r => (
          <ToggleButton key={r.value} value={r.value}>
            {r.label}
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
          size="small"
        />
 
        {availableDevices.map(d => (
          <Chip
            key={d.id}
            label={d.name}
            color={activeDeviceId === d.id ? "primary" : "default"}
            variant={activeDeviceId === d.id ? "filled" : "outlined"}
            onClick={() => onSwitchDevice(d.id)}
            size="small"
          />
        ))}
      </Stack>
    </Stack>
  </Grid>
</Grid>
 
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} lg={8}>
          <Grid container spacing={2}>
            {loadingHeart ? (
              [0, 1, 2].map((i) => (
                <Grid item xs={12} sm={4} key={i}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      borderRadius: 2,
                      background: alpha(theme.palette.background.default, 0.5),
                    }}
                  >
                    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <CircularProgress size={24} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                         {t("loading")}
                        </Typography>
                        <Typography variant="h6">--</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <>
                {[
                  { label: t("minimum"), value: data!.summary.minHeartRate, color: "info" },
                  { label: t("average"), value: data!.summary.avgHeartRate, color: "success" },
                  { label: t("average"), value: data!.summary.maxHeartRate, color: "error" },
                ].map((item, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Card
                      variant="outlined"
                      sx={{
                        height: "100%",
                        borderRadius: 2,
                        borderLeft: `4px solid ${theme.palette[item.color].main}`,
                        transition: "transform 0.2s",
                        "&:hover": { transform: "translateY(-2px)" },
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          {item.label}
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 800, color: theme.palette[item.color].dark }}
                        >
                          {item.value}
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: "text.secondary", ml: 0.5 }}
                          >
                            bpm
                          </Typography>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </>
            )}
          </Grid>
        </Grid>
 
        <Grid item xs={12} lg={4}>
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.light,
                0.05
              )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 600 }}
                >
                  <AccessTimeIcon sx={{ fontSize: 16 }} /> {t("lastMeasurement")}
                </Typography>
              <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700 }}>
  {latest?.ts && latest.ts > 0
    ? new Date(latest.ts).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : "--/--/---- --:--:--"}
</Typography>
              </Box>
 
              <Box sx={{ mt: "auto" }}>
                <Chip
                  label={latest ? `${latest.heartRate} bpm` : "--"}
                  color={getHeartRateStatus(latest?.heartRate)}
                  icon={<FavoriteIcon />}
                  sx={{
                    fontWeight: 700,
                    py: 1.5,
                    px: 2,
                    fontSize: isMobile ? 14 : 16,
                    height: "auto",
                    borderRadius: 2,
                    width: "100%",
                    justifyContent: "center",
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
 
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.secondary }}>
          {t("chartTitle")}
        </Typography>
 
        <Paper
          variant="outlined"
          sx={{
            overflow: "hidden",  
            p: { xs: 1, sm: 2, md: 3 },
            borderRadius: 2,
            background: theme.palette.background.default,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            minHeight: 300,
          }}
        >
          {loadingHeart ? (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ height: { xs: 250, sm: 300, md: 350 } }}>
              <HeartChart
                points={data?.points || []}
                summary={data?.summary}
                range={range}
                criticalAlertTimes={criticalAlertTimes}
              />
 
             
            </Box>
 
           
          )}
        </Paper>
      </Box>
    </Paper>
  );
}
 
 
 