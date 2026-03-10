import React from "react";
import { Box, Typography } from "@mui/material";

export type MetricValueSize = "small" | "medium" | "large";

type MetricValueProps = {
  value: string | number;
  unit?: string;
  label?: string;
  sub?: string;
  size?: MetricValueSize;
};

export function MetricValue({
  value,
  unit,
  label,
  sub,
  size = "medium",
}: MetricValueProps) {
  const sizeMap = {
    small: {
      value: "h6",
      unit: "caption",
    },
    medium: {
      value: "h5",
      unit: "body2",
    },
    large: {
      value: "h4",
      unit: "body1",
    },
  } as const;

  return (
    <Box
      sx={{
        textAlign: "center",
        lineHeight: 1.2,
      }}
    >
      {/* VALUE + UNIT */}
      <Box display="flex" alignItems="baseline" justifyContent="center" gap={0.5}>
        <Typography
          variant={sizeMap[size].value}
          fontWeight={700}
          noWrap
        >
          {value}
        </Typography>

        {unit && (
          <Typography
            variant={sizeMap[size].unit}
            color="text.secondary"
            noWrap
          >
            {unit}
          </Typography>
        )}
      </Box>

      {/* LABEL */}
      {label && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5 }}
          noWrap
        >
          {label}
        </Typography>
      )}

      {/* SUBTEXT */}
      {sub && (
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{
            mt: 0.75,
            maxWidth: 160,
            mx: "auto",
          }}
          noWrap
        >
          {sub}
        </Typography>
      )}
    </Box>
  );
}
