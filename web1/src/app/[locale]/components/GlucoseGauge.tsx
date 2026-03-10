"use client";
 
import React from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";
 
import { useTranslations } from "next-intl";
 
type Props = {
  value?: number;
};
 
function getStatusColor(value: number | undefined, theme: any) {
  if (value == null) return theme.palette.grey[400];
  if (value < 70) return theme.palette.info.main;       // Low
  if (value <= 140) return theme.palette.success.main;  // Normal
  if (value <= 199) return theme.palette.warning.main;  // High
  return theme.palette.error.main;                      // Very High
}
 
export default function GlucoseGauge({ value }: Props) {
  const theme = useTheme();
 
  const t = useTranslations("glucose");
 
  const safeValue = Math.min(Math.max(value ?? 0, 0), 250);
 
  const data = [
    {
      name: "glucose",
      value: safeValue,
      fill: getStatusColor(value, theme),
    },
  ];
 
  return (
    <Box sx={{ width: "100%", height: 260, position: "relative" }}>
      <ResponsiveContainer>
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          startAngle={180}
          endAngle={0}
          data={data}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 250]}
            tick={false}
          />
 
          <RadialBar
            dataKey="value"
            background
            cornerRadius={20}
          />
        </RadialBarChart>
      </ResponsiveContainer>
 
      {/* Center Value */}
      <Box
        sx={{
          position: "absolute",
          top: "60%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight={900}>
          {value ?? "--"}
        </Typography>
        <Typography fontSize={12} color="text.secondary">
         {t("unit")}
        </Typography>
      </Box>
    </Box>
  );
}
 