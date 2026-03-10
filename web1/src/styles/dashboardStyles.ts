import type { SxProps, Theme } from "@mui/material/styles";

export const pageSx: SxProps<Theme> = {
  minHeight: "100vh",
  bgcolor: "#ffffff",
  p: 2.75, // 22px
  color: "#111827",
};

export const headerSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
};

export const rowSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 1.75, // 14px
  mt: 2.5, // 20px
};

export const avatarCircleSx: SxProps<Theme> = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  bgcolor: "#e5e7eb",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const avatarImageSx: SxProps<Theme> = {
  width: "100%",
  height: "100%",
  borderRadius: "50%",
};

export const menuCardSx: SxProps<Theme> = {
  position: "absolute",
  right: 0,
  top: 54,
  width: 320,
  bgcolor: "#ffffff",
  borderRadius: 2,
  p: 2.25, // 18px
  boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
  zIndex: 100,
};

export const menuHeaderSx: SxProps<Theme> = {
  display: "flex",
  gap: 1.5, // 12px
};

export const menuNameSx: SxProps<Theme> = {
  fontWeight: 600,
};

export const menuSubSx: SxProps<Theme> = {
  fontSize: 13,
};

export const bigAvatarSx: SxProps<Theme> = {
  width: 46,
  height: 46,
  borderRadius: "50%",
  bgcolor: "#e5e7eb",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const deviceIconSx: SxProps<Theme> = {
  width: 46,
  height: 46,
  borderRadius: 1.5, // 12px
  bgcolor: "#1e88e5",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const infoRowBigSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 0.75, // 6px
  fontSize: 13,
  mb: 1.75, // 14px
  bgcolor: "#f9fafb",
  color: "#111827",
  p: "14px 16px",
  borderRadius: 1.5, // 12px
  border: "1px solid #e5e7eb",
  wordBreak: "break-all",
};

export const primaryBtnSx: SxProps<Theme> = {
  bgcolor: "#1e88e5",
  color: "#fff",
  p: 1.25, // 10px
  "&:hover": { bgcolor: "#1565c0" },
};

export const secondaryBtnSx: SxProps<Theme> = {
  bgcolor: "#1e88e5",
  color: "#fff",
  p: 1.25,
  "&:hover": { bgcolor: "#1565c0" },
};

export const logoutBtnBigSx: SxProps<Theme> = {
  bgcolor: "#e53935",
  color: "#fff",
  p: 1.25,
  "&:hover": { bgcolor: "#c62828" },
};

export const timeBoxSx: SxProps<Theme> = {
  mt: 1.5, // 12px
  mb: 1, // 8px
  px: 1.25, // 10px
  py: 0.75, // 6px
  bgcolor: "#ffffff",
  borderRadius: 1,
  display: "inline-flex",
  gap: 1.5, // 12px
  fontSize: 12,
  color: "#111827",
  border: "1px solid #e5e7eb",
};

export const alertRowSx: SxProps<Theme> = {
  display: "flex",
  gap: 1.75, // 14px
  mt: 1.75, // 14px
  mb: 1.25, // 10px
  overflowX: "auto",
  pb: 0.75, // 6px
};

export const alertCardHorizontalSx = (
  severity: "CRITICAL" | "WARNING"
): SxProps<Theme> => ({
  minWidth: 260,
  maxWidth: 300,
  bgcolor: "#ffffff",
  color: "#111827",
  borderLeft: `6px solid ${severity === "CRITICAL" ? "#dc2626" : "#f59e0b"}`,
  p: 1.75, // 14px
  borderRadius: 1.5,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 1.25, // 10px
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
});

export const ackButtonSx = (
  s: "CRITICAL" | "WARNING"
): SxProps<Theme> => ({
  bgcolor: s === "CRITICAL" ? "#dc2626" : "#f59e0b",
  color: "#fff",
  px: 1.5,
  py: 0.75,
  "&:hover": {
    bgcolor: s === "CRITICAL" ? "#b91c1c" : "#d97706",
  },
});

export const smallTextSx: SxProps<Theme> = {
  fontSize: 12,
  opacity: 0.8,
};
