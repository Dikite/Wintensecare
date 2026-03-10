"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  Box,
  Typography,
  BoxProps,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";

/* ---------------- types ---------------- */

export type MuiMetricCardProps = {
  title?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  status?: "normal" | "warning" | "critical";

  /** NEW – optional enhancements */
  icon?: React.ReactNode;
  iconColor?: string;
  accent?: string;
  loading?: boolean;

  /** SAFE sx support (NO union explosion) */
  sx?: BoxProps["sx"];
};

/* ---------------- constants ---------------- */

const STATUS_COLORS = {
  normal: "#e8f5e9",
  warning: "#fff8e1",
  critical: "#ffebee",
} as const;

/* ---------------- styled components (NO sx here) ---------------- */

const StyledCard = styled(Card)(({ theme }) => ({
  height: 140,
  borderRadius: theme.shape.borderRadius * 2,
  transition: "box-shadow 0.2s ease",
}));

const StyledActionArea = styled(CardActionArea)({
  height: "100%",
  display: "flex",
  alignItems: "stretch",
});

const StyledContent = styled(CardContent)({
  padding: 16,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

const Header = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const Center = styled(Box)({
 flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: 8,
});

/* ---------------- component ---------------- */

export const MuiMetricCard: React.FC<MuiMetricCardProps> = ({
  title,
  children,
  onClick,
  status = "normal",
  icon,
  iconColor,
  accent,
  loading = false,
  sx,
}) => {
  return (
    <StyledCard
      elevation={2}
      sx={{
        backgroundColor: accent,
        "&:hover": onClick ? { boxShadow: 6 } : undefined,
        ...sx, // SAFE spread
      }}
    >
      <StyledActionArea
        onClick={onClick}
        disabled={!onClick || loading}
        style={{ cursor: onClick ? "pointer" : "default" }}
      >
        <StyledContent>
          <Header>
            {title && (
              <Typography variant="subtitle2" fontWeight={600}>
                {title}
              </Typography>
            )}

            <Box display="flex" alignItems="center" gap={1}>
              {icon && (
                <Box color={iconColor} display="flex">
                  {icon}
                </Box>
              )}
              <Box
                width={10}
                height={10}
                borderRadius="50%"
                bgcolor={STATUS_COLORS[status]}
              />
            </Box>
          </Header>

          <Center>
            {loading ? <CircularProgress size={24} /> : children}
          </Center>
        </StyledContent>
      </StyledActionArea>
    </StyledCard>
  );
};

export default MuiMetricCard;
