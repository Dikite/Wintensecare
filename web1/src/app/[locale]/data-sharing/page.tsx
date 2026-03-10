"use client";

import React from "react";
import {
  Container,
  Stack,
  Typography,
  Button,
  Paper,
  IconButton,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import Protected from "@/lib/api/protected";
import { useDoctors } from "@/hooks/useDoctors";
import DoctorAccessCard from "../dashboard/components/DoctorAccessCard";

export default function DataSharingPage() {
  const {
    doctors,
    history,
    loading,
    loadingHistory,
    fetchHistory,
    changeAccess,
    removeDoctor,
    grantAccess,
    deletePermanent,
  } = useDoctors();

  // 🔑 SINGLE SOURCE OF TRUTH
  const [view, setView] = React.useState<"LIST" | "HISTORY">("LIST");

const handleGrantAccess = async (id: string) => {
  await grantAccess(id);
  setView("LIST"); // 👈 go back to Data Sharing
};

const handleDeletePermanent = async (id: string) => {
  await deletePermanent(id);
};




  /* ================= HISTORY VIEW ================= */
  if (view === "HISTORY") {
    return (
      <Protected>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid rgba(15,23,42,0.08)",
              bgcolor: "#ffffff",
              position: "relative",
            }}
          >
            {/* ❌ EXIT BUTTON */}
            <IconButton
              onClick={() => setView("LIST")}
              sx={{ position: "absolute", top: 12, right: 12 }}
            >
              <CloseRoundedIcon />
            </IconButton>

            <Typography variant="h5" fontWeight={700} mb={3}>
              Doctor Access History
            </Typography>

            {loadingHistory ? (
              <Typography>Loading history…</Typography>
            ) : history.length === 0 ? (
              <Typography>No history available</Typography>
            ) : (
              <Stack spacing={2}>
                {history.map((doctor) => (
                  <DoctorAccessCard
                    key={doctor.id}
                    id={doctor.id}
                    doctorName={doctor.doctorName}
                    doctorId={doctor.doctorId}
                    access={doctor.access}
                    status={doctor.status}
                  onChangeAccess={changeAccess}     // ✅ REQUIRED
                  onRevokeDoctor={removeDoctor}     // ✅ REQUIRED
                  onGrantAccess={handleGrantAccess}
                  onDeletePermanent={handleDeletePermanent}
                  />
                ))}
              </Stack>
            )}
          </Paper>
        </Container>
      </Protected>
    );
  }

  /* ================= DATA SHARING (DEFAULT VIEW) ================= */
  return (
    <Protected>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Data Sharing
        </Typography>

        {/* VIEW HISTORY BUTTON */}
        <Button
          variant="outlined"
          sx={{ mb: 3 }}
          onClick={() => {
            fetchHistory();   // fetch once
            setView("HISTORY");
          }}
        >
          View History
        </Button>

        {loading ? (
          <Typography>Loading doctors…</Typography>
        ) : doctors.length === 0 ? (
          <Typography>No doctors found</Typography>
        ) : (
          <Stack spacing={2}>
            {doctors.map((doctor) => (
              <DoctorAccessCard
                key={doctor.id}
                id={doctor.id}
                doctorName={doctor.doctorName}
                doctorId={doctor.doctorId}
                access={doctor.access}
                status={doctor.status}
                onChangeAccess={changeAccess}
                onRevokeDoctor={removeDoctor}
              />
            ))}
          </Stack>
        )}
      </Container>
    </Protected>
  );
}
