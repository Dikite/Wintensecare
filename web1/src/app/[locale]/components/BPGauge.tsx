"use client";
 
import { Box, Typography, useTheme, alpha } from "@mui/material";
 
import { useTranslations } from "next-intl";
 
type Props = {
  systolic?: number;
  diastolic?: number;
  pulse?: number;
};
 
export default function BPGauge({ systolic, diastolic, pulse }: Props) {
  const theme = useTheme();
 
  const t = useTranslations("bp");
 
  const ARC_LENGTH = 251; // correct half-circle length
 
  /* ================= BP (UPPER U) ================= */
  const bpPercent =
    typeof systolic === "number"
      ? Math.min(Math.max((systolic - 90) / 70, 0), 1)
      : 0;
 
  const bpArc = ARC_LENGTH * bpPercent;
 
  /* ================= PULSE (LOWER U) ================= */
  const pulsePercent =
    typeof pulse === "number"
      ? Math.min(Math.max((pulse - 40) / 80, 0), 1)
      : 0;
 
  const pulseArc = ARC_LENGTH * pulsePercent;
 
  return (
    <Box sx={{ width: "100%", textAlign: "center" }}>
      {/* ===== BP VALUE ===== */}
      <Typography variant="h4" fontWeight={900}>
        {systolic ?? "--"} / {diastolic ?? "--"}
        <Typography component="span" variant="body2">
          {" "}{t("sys")}
        </Typography>
      </Typography>
 
      <Typography
        variant="body2"
        color="text.secondary"
        fontWeight={600}
        sx={{ mb: 2 }}
      >
       {t("rangeIndicator")}
      </Typography>
 
      {/* ===== GAUGE SVG ===== */}
      <svg width="220" height="200" viewBox="0 0 220 220">
        {/* --- Upper BP background --- */}
        <path
          d="M30 90 A80 80 0 0 1 190 90"
          fill="none"
          stroke={alpha(theme.palette.text.primary, 0.15)}
          strokeWidth="12"
        />
 
        {/* --- Upper BP active --- */}
        <path
          d="M30 90 A80 80 0 0 1 190 90"
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth="12"
          strokeDasharray={`${bpArc} ${ARC_LENGTH}`}
          strokeLinecap="round"
        />
 
        {/* --- Lower Pulse background --- */}
        <path
          d="M30 130 A80 80 0 0 0 190 130"
          fill="none"
          stroke={alpha(theme.palette.text.primary, 0.15)}
          strokeWidth="12"
        />
 
        {/* --- Lower Pulse active --- */}
        <path
          d="M30 130 A80 80 0 0 0 190 130"
          fill="none"
          stroke={theme.palette.success.main}
          strokeWidth="12"
          strokeDasharray={`${pulseArc} ${ARC_LENGTH}`}
          strokeLinecap="round"
        />
      </svg>
 
      {/* ===== Pulse text ===== */}
      <Typography variant="body1" fontWeight={800}>
        {t("pulse")}: {pulse ?? "--"} {t("bpm")}
      </Typography>
    </Box>
  );
}
 
 