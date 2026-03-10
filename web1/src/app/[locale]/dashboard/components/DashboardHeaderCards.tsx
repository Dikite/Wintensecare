"use client";
 
import React from "react";
import {
  Stack,
  Paper,
  Typography,
  Box,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
 import { useTranslations } from "next-intl";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
 
import DoctorAccessCard from "./DoctorAccessCard";
 
/* ===================== TYPES ===================== */
 
export type Doctor = {
  id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  access: "FULL" | "LIMITED";
  status: "ACTIVE" | "REVOKED";
  createdAt: string;
};
 
type Props = {
  currentTime: string;
  currentDate: string;
  unifiedMeasurementTime: Date | null;
  doctors: Doctor[];
  onChangeAccess: (id: string, access: "FULL" | "LIMITED") => Promise<void>;
  onRemoveDoctor: (id: string) => Promise<void>;
};

/* ===================== COMPONENT ===================== */
 
export default function DashboardHeaderCards({
  currentTime,
  currentDate,
  unifiedMeasurementTime,
  doctors,
  onChangeAccess,
  onRemoveDoctor,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
 
  // ✅ Only ACTIVE doctors
  const activeDoctors = React.useMemo(
    () => doctors.filter((d) => d.status === "ACTIVE"),
    [doctors]
  );
 const t = useTranslations("dashboardHeader");
  // ✅ Slider index
  const [index, setIndex] = React.useState(0);
 
  // ✅ Current doctor
  const currentDoctor = activeDoctors[index] ?? null;
 
  const handleNext = () => {
  if (index < activeDoctors.length - 1) {
    setIndex(index + 1);
  }
};
 
const handlePrev = () => {
  if (index > 0) {
    setIndex(index - 1);
  }
};


 
 
  return (
    <Stack
      direction={isMobile ? "column" : "row"}
      spacing={2}
      mb={3}
      alignItems="stretch"
    >
      {/* ================= LEFT : TIME CARD ================= */}
      <Box sx={{ flex: 1 }}>
        <TimeMeasurementCard
          currentTime={currentTime}
          currentDate={currentDate}
          unifiedMeasurementTime={unifiedMeasurementTime}
        />
      </Box>
 
      {/* ================= RIGHT : DOCTOR CARD ================= */}
      <Box sx={{ flex: 1, position: "relative" }}>
        {currentDoctor ? (
          <>
           
           {/* LEFT ARROW */}
{activeDoctors.length > 1 && index > 0 && (
  <IconButton
    onClick={handlePrev}
    sx={{
      position: "absolute",
      left: -16,
      top: "45%",
      zIndex: 2,
    }}
  >
    <ChevronLeftRoundedIcon />
  </IconButton>
)}
 
{/* DOCTOR CARD */}
<DoctorAccessCard
  id={currentDoctor.id}
  doctorName={currentDoctor.doctorName}
  doctorId={currentDoctor.doctorId}
  access={currentDoctor.access}
  status={currentDoctor.status}
  onChangeAccess={onChangeAccess}
  onRevokeDoctor={onRemoveDoctor}
/>
 
{/* RIGHT ARROW */}
{activeDoctors.length > 1 && index < activeDoctors.length - 1 && (
  <IconButton
    onClick={handleNext}
    sx={{
      position: "absolute",
      right: -16,
      top: "45%",
      zIndex: 2,
    }}
  >
    <ChevronRightRoundedIcon />
  </IconButton>
)}
 
          </>
        ) : (
          <Paper
            sx={{
              height: "100%",
              p: 2.5,
              borderRadius: 3,
              bgcolor: "#f8fafc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
              fontWeight: 600,
            }}
          >
           {t("noActiveDoctors")}
          </Paper>
        )}
      </Box>
    </Stack>
  );
}
 
/* ===================== TIME CARD ===================== */
 
function TimeMeasurementCard({
  currentTime,
  currentDate,
  unifiedMeasurementTime,
}: {
  currentTime: string;
  currentDate: string;
  unifiedMeasurementTime: Date | null;
}) {

   const t = useTranslations("dashboardHeader");
  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        p: 2.5,
        borderRadius: 3,
        bgcolor: "#ffffff",
        border: "1px solid rgba(15,23,42,0.08)",
        boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
      }}
    >
      <Stack spacing={2}>
        {/* SYSTEM TIME */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconBox>
            <AccessTimeRoundedIcon />
          </IconBox>
 
          <Box>
            <Typography variant="caption" fontWeight={700} color="#64748b">
              {t("systemTime")}
            </Typography>
 
            <Typography variant="h5" fontWeight={700} color="#0f172a">
              {currentTime}
            </Typography>
 
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CalendarTodayRoundedIcon sx={{ fontSize: 13, color: "#94a3b8" }} />
              <Typography variant="caption" color="#64748b">
                {currentDate}
              </Typography>
            </Stack>
          </Box>
        </Stack>
 
        <Divider />
 
        {/* LATEST MEASUREMENT */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconBox>
            <TrendingUpRoundedIcon />
          </IconBox>
 
          <Box>
            <Typography variant="caption" fontWeight={700} color="#64748b">
             {t("latestMeasurement")}
            </Typography>
 
            <Typography variant="h6" fontWeight={700} color="#0f172a">
              {unifiedMeasurementTime
                ? unifiedMeasurementTime.toLocaleTimeString("en-GB", {
                    hour12: false,
                  })
                : "--:--:--"}
            </Typography>
 
            <Typography variant="caption" color="#64748b">
              {unifiedMeasurementTime
  ? unifiedMeasurementTime.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  : t("noData")}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}
 
/* ===================== ICON BOX ===================== */
 
function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: 2,
        bgcolor: "rgba(15,23,42,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#0f172a",
      }}
    >
      {children}
    </Box>
  );
}
 
 
 