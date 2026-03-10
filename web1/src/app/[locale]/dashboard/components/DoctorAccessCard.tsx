"use client";

import React from "react";
import {
  Paper,
  Stack,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useTranslations } from "next-intl";

import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

/* ===================== TYPES ===================== */

type Props = {
  id: string;
  doctorName: string;
  doctorId: string;

  access: "FULL" | "LIMITED";
  status: "ACTIVE" | "REVOKED";

  onChangeAccess: (id: string, access: "FULL" | "LIMITED") => Promise<void>;
  onRevokeDoctor: (id: string) => Promise<void>;
  onGrantAccess?: (id: string) => Promise<void>;
  onDeletePermanent?: (id: string) => Promise<void>;
};

/* ===================== COMPONENT ===================== */

export default function DoctorAccessCard({
  id,
  doctorName,
  doctorId,
  access,
  status,
  onChangeAccess,
  onRevokeDoctor,
  onGrantAccess,
  onDeletePermanent,
}: Props) {
  const t = useTranslations("doctorAccess");

  const [openRevoke, setOpenRevoke] = React.useState(false);
  const [openChange, setOpenChange] = React.useState(false);

  const nextAccess = access === "FULL" ? "LIMITED" : "FULL";

  const handleConfirmRevoke = async () => {
    await onRevokeDoctor(id);
    setOpenRevoke(false);
  };

  const handleConfirmChangeAccess = async () => {
    await onChangeAccess(id, nextAccess);
    setOpenChange(false);
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          bgcolor: "#ffffff",
          border: "1px solid rgba(15,23,42,0.08)",
          boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
        }}
      >
        <Stack spacing={1.5}>
          {/* HEADER */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: "rgba(15,23,42,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MedicalServicesRoundedIcon />
            </Box>

            <Typography variant="caption" fontWeight={700} color="#64748b">
              {t("title")}
            </Typography>
          </Stack>

          {/* NAME */}
          <Typography variant="h6" fontWeight={700}>
            {doctorName}
          </Typography>

          {/* IDS */}
          <Stack spacing={0.5}>
            <Typography variant="caption">
              {t("doctorId")}: <strong>{doctorId}</strong>
            </Typography>

            <Typography variant="caption">
              <VerifiedUserRoundedIcon sx={{ fontSize: 14, mr: 0.5 }} />
              {t("recordId")}: <strong>{id}</strong>
            </Typography>
          </Stack>

          {/* STATUS */}
          <Stack direction="row" spacing={1}>
            <Chip
              label={access}
              color={access === "FULL" ? "success" : "warning"}
              size="small"
            />
            <Chip
              label={status}
              color={status === "ACTIVE" ? "info" : "default"}
              size="small"
            />
          </Stack>

          {/* ACTIONS */}
          <Stack direction="row" spacing={1} mt={1}>
            {status === "ACTIVE" && (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<SwapHorizRoundedIcon />}
                  onClick={() => setOpenChange(true)}
                >
                  {t("changeAccess")}
                </Button>

                <Button
                  size="small"
                  color="warning"
                  variant="outlined"
                  startIcon={<DeleteRoundedIcon />}
                  onClick={() => setOpenRevoke(true)}
                >
                  {t("removeAccess")}
                </Button>
              </>
            )}

            {status === "REVOKED" && (
              <>
                <Button
                  size="small"
                  color="success"
                  variant="outlined"
                  onClick={() => onGrantAccess?.(id)}
                >
                  {t("grantAccess")}
                </Button>

                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => onDeletePermanent?.(id)}
                >
                  {t("deletePermanent")}
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* CHANGE ACCESS DIALOG */}
      <Dialog open={openChange} onClose={() => setOpenChange(false)}>
        <DialogTitle>{t("changeAccessTitle")}</DialogTitle>

        <DialogContent>
          <Typography>
            {t("changeAccessText", {
              name: doctorName,
              current: access,
              next: nextAccess,
            })}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenChange(false)}>{t("cancel")}</Button>

          <Button variant="contained" onClick={handleConfirmChangeAccess}>
            {t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* REVOKE ACCESS DIALOG */}
      <Dialog open={openRevoke} onClose={() => setOpenRevoke(false)}>
        <DialogTitle>{t("revokeTitle")}</DialogTitle>

        <DialogContent>
          <Typography>
            {t("revokeText", { name: doctorName })}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenRevoke(false)}>
            {t("cancel")}
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmRevoke}
          >
            {t("revoke")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}