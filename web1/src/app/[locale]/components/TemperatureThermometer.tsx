"use client";
 
import { Box, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
 
type Props = {
  value?: number | null;
};
 
export default function TemperatureThermometer({ value }: Props) {
  const theme = useTheme();
 
  const t = useTranslations("temperature");
 
  const minTemp = 34;
  const maxTemp = 40;
 
  const hasValue = typeof value === "number";
 
  const clamped = hasValue
    ? Math.max(minTemp, Math.min(maxTemp, value))
    : minTemp;
 
  const percentage = hasValue
    ? ((clamped - minTemp) / (maxTemp - minTemp)) * 100
    : 0;
 
  let color = theme.palette.grey[400];
  let status = "--";
 
  if (hasValue) {
    if (clamped >= 37.6) {
      color = theme.palette.error.main;
     status = t("high");
    } else if (clamped >= 36.0) {
      color = theme.palette.success.main;
      status = t("normal");
 
    } else {
      color = theme.palette.info.main;
      status = t("low");
    }
  }
 
  return (
    <Box
      sx={{
        width: 90,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Thermometer */}
      <Box
        sx={{
          position: "relative",
          width: 28,
          height: 200,
          borderRadius: 14,
          background: theme.palette.grey[300],
          overflow: "hidden",
        }}
      >
        {/* Liquid */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: `${percentage}%`,
            background: color,
            transition: "height 0.4s ease",
          }}
        />
 
        {/* Bulb */}
        <Box
          sx={{
            position: "absolute",
            bottom: -18,
            left: "50%",
            transform: "translateX(-50%)",
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: color,
            boxShadow: hasValue ? `0 0 12px ${color}` : "none",
          }}
        />
      </Box>
 
      {/* Value */}
      <Typography
        variant="subtitle2"
        fontWeight={700}
        sx={{ mt: 2 }}
      >
        {hasValue ? `${value!.toFixed(1)} °C` : "--"}
      </Typography>
 
      {/* Status */}
      <Typography
        variant="caption"
        fontWeight={700}
        sx={{ color, mt: 0.5 }}
      >
        {status}
      </Typography>
    </Box>
  );
}
 