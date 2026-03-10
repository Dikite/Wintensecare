"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
/* ================= TYPES ================= */

type Props = {
  value: number | null;
};

/* ================= HELPERS ================= */

function getStressZone(value: number | null) {
  if (value == null)
    return {
      key: "noData",
      range: "",
      color: "#CBD5E1",
    };

  if (value < 30)
    return {
      key: "relax",
      range: "1–29",
      color: "#4FD1C5",
    };

  if (value < 60)
    return {
      key: "normal",
      range: "30–59",
      color: "#38BDF8",
    };

  if (value < 80)
    return {
      key: "moderate",
      range: "60–79",
      color: "#FACC15",
    };

  return {
    key: "high",
    range: "80–99",
    color: "#FB7185",
  };
}

/* ================= COMPONENT ================= */

export default function StressDonut({ value }: Props) {
  const zone = getStressZone(value);
const t = useTranslations("stressDonut");
  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: 3,
        p: 3,
        width: 260,
        textAlign: "center",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      }}
    >
      {/* CIRCLE */}
      <Box
        sx={{
          width: 160,
          height: 160,
          mx: "auto",
          borderRadius: "50%",
          border: `18px solid ${zone.color}`,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Typography fontWeight={800}>
          {t("zone")}
        </Typography>
      </Box>

      {/* STATUS */}
      <Typography
        fontWeight={900}
        fontSize={20}
        sx={{ mt: 2 }}
      >
        {zone.key}
      </Typography>

      {/* RANGE */}
      {zone.range && (
        <Typography
          fontWeight={700}
          color="text.secondary"
        >
          {zone.range}
        </Typography>
      )}
    </Box>
  );
}
