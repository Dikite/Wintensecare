"use client";
 
import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Stack,
  Typography,
  Tooltip,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  Button,
} from "@mui/material";
import { useRouter, usePathname } from "@/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
 
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
 
 
 
type Props = {
  user?: any;
  vitalAlerts: any[];
   devices: any[];        // ✅ add this
  currentDevice?: any;
  setDevice: (d: any) => void;
  logout: () => void;
  handleRefresh: () => void;
};
 
export default function DashboardNavbar({
  user,
  vitalAlerts,
  setDevice,
  devices,
  currentDevice,
  logout,
  handleRefresh,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
 
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
 
  const [deviceAnchor, setDeviceAnchor] =
  React.useState<HTMLElement | null>(null);
 
  const t = useTranslations("navbar");
  const [live, setLive] = React.useState(true);
const locale = useLocale();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
 
 
 
  const changeLanguage = (locale: string) => {
    router.replace(pathname, { locale });
  };
 
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
 
    const yOffset = -80;
    const y =
      el.getBoundingClientRect().top + window.pageYOffset + yOffset;
 
    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };
 
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        borderBottom: "1px solid rgba(15,23,42,0.08)",
 
        "@keyframes livePulse": {
          "0%": { transform: "scale(1)", opacity: 1 },
          "70%": { transform: "scale(1.5)", opacity: 0 },
          "100%": { opacity: 0 },
        },
      }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          px: { xs: 2, md: 3 },
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* LEFT */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: "linear-gradient(135deg, #0f172a, #020617)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            W
          </Box>
 
          <Box>
            <Typography fontWeight={700} color="#0f172a" lineHeight={1}>
              Wintensecare
            </Typography>
            <Typography
              variant="caption"
              color="#64748b"
              display={{ xs: "none", sm: "block" }}
            >
              Real-time Monitoring Dashboard
            </Typography>
          </Box>
        </Stack>
 
        {/* RIGHT */}
        <Stack direction="row" spacing={1.5} alignItems="center">
 
          <Button
  startIcon={<DevicesRoundedIcon />}
  size="small"
  onClick={(e) => setDeviceAnchor(e.currentTarget)}
  sx={{
    borderRadius: 2,
    textTransform: "none",
    fontWeight: 600,
    fontSize: 13,
    border: "1px solid #e2e8f0",
    color: "#0f172a",
    bgcolor: "#f8fafc",
  }}
>
  {currentDevice?.name ?? "Select Device"}
</Button>
 
          {/* LANGUAGE SWITCHER */}
          <Box>
         <select
  value={locale}
  onChange={(e) => changeLanguage(e.target.value)}
  style={{
    borderRadius: 8,
    padding: "6px 10px",
    border: "1px solid #e2e8f0",
    background: "#fff",
    fontSize: 13,
    cursor: "pointer",
  }}
>
  <option value="en">EN</option>
  <option value="ta">தமிழ்</option>
  <option value="hi">हिंदी</option>
  <option value="te">తెలుగు</option>
  <option value="kn">ಕನ್ನಡ</option>
  <option value="ml">മലയാളം</option>
</select>
          </Box>
 
          {/* LIVE BUTTON */}
          <Button
            onClick={() => {
              setLive(!live);
              router.push("/live");
            }}
            startIcon={<MonitorHeartRoundedIcon />}
            sx={{
              position: "relative",
              height: 38,
              px: 2.4,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 13,
              textTransform: "none",
              color: live ? "#fff" : "#0f172a",
              bgcolor: live ? "#ef4444" : "#f1f5f9",
              border: live ? "none" : "1px solid rgba(15,23,42,0.1)",
              boxShadow: live ? "0 4px 16px rgba(239,68,68,0.35)" : "none",
              transition: "all .25s ease",
              "&:hover": {
                bgcolor: live ? "#dc2626" : "#e2e8f0",
              },
 
              "&::after": live
                ? {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    borderRadius: "inherit",
                    border: "2px solid rgba(239,68,68,0.5)",
                    animation: "livePulse 1.6s infinite",
                  }
                : {},
            }}
          >
           {live ? t("live") : t("startLive")}
          </Button>
 
          {/* REFRESH */}
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} sx={iconStyle}>
              <RefreshRoundedIcon />
            </IconButton>
          </Tooltip>
 
          {/* ALERTS */}
          <Tooltip title="Alerts">
            <IconButton
              sx={iconStyle}
              onClick={() => scrollToSection("alerts-section")}
            >
              <Badge badgeContent={vitalAlerts.length} color="error">
                <NotificationsNoneRoundedIcon />
              </Badge>
            </IconButton>
          </Tooltip>
 
          {/* AVATAR */}
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              p: 0.5,
              border: "1px solid rgba(15,23,42,0.1)",
            }}
          >
            <Avatar
              src={user?.profileImage ?? undefined}
              sx={{
                width: 34,
                height: 34,
                fontSize: 14,
                bgcolor: "#0f172a",
              }}
            >
              {user?.email?.[0]?.toUpperCase()}
            </Avatar>
          </IconButton>
 
          {/* MENU */}
         {/* AVATAR MENU */}
<Menu
  anchorEl={anchorEl}
  open={open}
  onClose={() => setAnchorEl(null)}
  transformOrigin={{ horizontal: "right", vertical: "top" }}
  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
>
  <MenuItem
    onClick={() => {
      setAnchorEl(null);
      router.push("/profile");
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center">
      <PersonOutlineRoundedIcon fontSize="small" />
      <Typography fontSize={14}>{t("profile")}</Typography>
    </Stack>
  </MenuItem>
 
  <MenuItem
    onClick={() => {
      setAnchorEl(null);
      setDevice(null);
      router.push("/devices");
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center">
      <DevicesRoundedIcon fontSize="small" />
      <Typography fontSize={14}>{t("devices")}</Typography>
    </Stack>
  </MenuItem>
 
  <MenuItem
    onClick={() => {
      setAnchorEl(null);
      router.push("/data-sharing");
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center">
      <MedicalServicesRoundedIcon fontSize="small" />
      <Typography fontSize={14}>{t("dataSharing")}</Typography>
    </Stack>
  </MenuItem>
 
  <MenuItem
    onClick={() => {
      setAnchorEl(null);
      router.push("/profile/permissions");
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center">
      <SecurityRoundedIcon fontSize="small" />
      <Typography fontSize={14}>{t("permissions")}</Typography>
    </Stack>
  </MenuItem>
 
  <Divider sx={{ my: 0.5 }} />
 
  <MenuItem
    onClick={() => {
      setAnchorEl(null);
      logout();
    }}
    sx={{ color: "error.main" }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center">
      <LogoutRoundedIcon fontSize="small" />
      <Typography fontSize={14}>{t("logout")}</Typography>
    </Stack>
  </MenuItem>
</Menu>
 
<Menu
  anchorEl={deviceAnchor}
  open={Boolean(deviceAnchor)}
  onClose={() => setDeviceAnchor(null)}
>
  {devices?.length ? (
    devices.map((d) => (
      <MenuItem
        key={d.id}
        selected={currentDevice?.id === d.id}
        onClick={() => {
          setDevice(d);
          localStorage.setItem("deviceId", d.id);
          setDeviceAnchor(null);
        }}
      >
        {d.name ?? "Device"}
      </MenuItem>
    ))
  ) : (
    <MenuItem disabled>No devices</MenuItem>
  )}
 
   <Divider />
 
  {/* Create device */}
  <MenuItem
    onClick={() => {
      setDeviceAnchor(null);
      router.push("/devices?create=true");
    }}
  >
    + Create Device
  </MenuItem>
</Menu>
 
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
 
const iconStyle = {
  color: "#0f172a",
  bgcolor: alpha("#0f172a", 0.04),
  border: "1px solid rgba(15,23,42,0.08)",
  "&:hover": {
    bgcolor: alpha("#0f172a", 0.08),
  },
};
 