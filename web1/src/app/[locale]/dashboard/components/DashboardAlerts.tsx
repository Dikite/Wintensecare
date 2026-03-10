"use client";
 
import React from "react";
import {
  Fade,
  Stack,
  Paper,
  Typography,
  Button,
  Chip,
  Box,
} from "@mui/material";
import { useTranslations } from "next-intl";
 
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
 
type Props = {
  vitalAlerts: any[];
  acknowledgeAlert: (id: string) => void;
  isMobile: boolean;
};
 
export default function DashboardAlerts({
  vitalAlerts,
  acknowledgeAlert,
  isMobile,
}: Props) {
  if (!vitalAlerts.length) return null;

  return (
    <Fade in>
      <Stack 
      id="alerts-section" 
      spacing={1.5} mb={3}>
        {vitalAlerts.map((a) => (
          <AlertCard
            key={a.id}
            alert={a}
            acknowledgeAlert={acknowledgeAlert}
            isMobile={isMobile}
          />
        ))}
      </Stack>
    </Fade>
  );
}
 
function AlertCard({
  alert: a,
  acknowledgeAlert,
  isMobile,
}: {
  alert: any;
  acknowledgeAlert: (id: string) => void;
  isMobile: boolean;
}) {
  const isCritical = a.severity === "CRITICAL";
 const t = useTranslations("alerts");
  return (
    <Paper
      elevation={0}
      sx={{
        p: isMobile ? 1.5 : 2,
        borderRadius: 3,
        bgcolor: "#ffffff",
        border: "1px solid rgba(15,23,42,0.08)",
        borderLeft: `4px solid ${
          isCritical ? "#dc2626" : "#f59e0b"
        }`,
        boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={2}
        alignItems={isMobile ? "flex-start" : "center"}
        justifyContent="space-between"
      >
        <Stack spacing={0.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: "rgba(15,23,42,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isCritical ? "#dc2626" : "#f59e0b",
              }}
            >
              {a.metric === "HEART_RATE" ? (
                <FavoriteRoundedIcon fontSize="small" />
              ) : (
                <BatteryChargingFullRoundedIcon fontSize="small" />
              )}
            </Box>
 
            <Typography fontWeight={700} color="#0f172a">
              {a.metric === "HEART_RATE"
  ? t("heartRateAlert")
  : t("batteryAlert")}
            </Typography>
 
            <Chip
              label={a.severity}
              size="small"
              color={isCritical ? "error" : "warning"}
              sx={{ height: 20, fontSize: 10, fontWeight: 700 }}
            />
          </Stack>
 
          <Typography variant="body2" color="#334155">
          {a.metric === "HEART_RATE"
  ? t("heartRateRecorded", { value: a.value })
  : t("batteryDropped", { value: a.value })}
          </Typography>
 
          <Typography variant="caption" color="#64748b">
            {new Date(a.createdAt).toLocaleString()}
          </Typography>
        </Stack>
 
        <Button
          onClick={() => acknowledgeAlert(a.id)}
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 2,
            borderColor: "rgba(15,23,42,0.2)",
            color: "#0f172a",
            "&:hover": {
              borderColor: "#0f172a",
              bgcolor: "rgba(15,23,42,0.04)",
            },
          }}
        >
        {t("acknowledge")}
        </Button>
      </Stack>
    </Paper>
  );
}
 
 