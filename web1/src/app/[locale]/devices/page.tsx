"use client";
 
import { useEffect, useState } from "react";
import Protected from "@/lib/api/protected";
import { getDevices, addDevice, deleteDevice, Device } from "@/lib/api/devices";
import { useRouter } from "@/navigation";
 
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Container,
   Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
 
import WatchRoundedIcon from "@mui/icons-material/WatchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
 
import { useTranslations } from "next-intl";
 
 
 
export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
 
  const t = useTranslations("devices");
 
  const [deleteId, setDeleteId] = useState<string | null>(null);
 
  useEffect(() => {
    async function loadDevices() {
      try {
        const res = await getDevices();
        setDevices(res);
      } catch (err) {
        console.error("Failed to load devices", err);
      } finally {
        setLoading(false);
      }
    }
 
    loadDevices();
  }, []);
 
 
const [openDialog, setOpenDialog] = useState(false);
const [deviceName, setDeviceName] = useState("");
const [deviceType, setDeviceType] = useState("");
 
 function handleAddDevice() {
  setDeviceName("");
  setDeviceType("");
  setOpenDialog(true);
}
     
 
  async function confirmAddDevice() {
  try {
    const res = await addDevice({
      name: deviceName,
      type: deviceType,
    });
 
    setDevices((prev) => [
      ...prev,
      {
        id: res.id,
        name: deviceName,
        type: deviceType,
        createdAt: new Date().toISOString(),
      },
    ]);
 
    setOpenDialog(false);
    setDeviceName("");
    setDeviceType("");
  } catch (err) {
    console.error("Failed to add device", err);
  }
}
 
  function selectDevice(deviceId: string) {
    localStorage.setItem("deviceId", deviceId);
    router.replace("/dashboard");
  }
 
  async function handleDeleteDevice(id: string) {
  try {
    await deleteDevice(id);
 
    setDevices((prev) => prev.filter((d) => d.id !== id));
  } catch (err) {
    console.error("Failed to delete device", err);
  }
}
 
 
 
  return (
    <Protected>
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          background:
            "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
        }}
      >
 
<Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
  <DialogTitle>{t("addNewDevice")}</DialogTitle>
 
  <DialogContent>
    <Stack spacing={3} mt={1}>
      <TextField
       label={t("deviceName")}
        fullWidth
        value={deviceName}
        onChange={(e) => setDeviceName(e.target.value)}
      />
 
      <TextField
        label={t("wearableType")}
        fullWidth
        value={deviceType}
        onChange={(e) => setDeviceType(e.target.value)}
        placeholder="Ex: Android Wearable"
      />
    </Stack>
  </DialogContent>
 
  {/* 👇 THIS WAS MISSING */}
  <DialogActions sx={{ p: 2 }}>
    <Button onClick={() => setOpenDialog(false)}>
      {t("cancel")}
    </Button>
 
    <Button
      variant="contained"
      onClick={confirmAddDevice}
      disabled={!deviceName || !deviceType}
    >
      {t("confirm")}
    </Button>
  </DialogActions>
</Dialog>
 
{/* Delete Confirmation Dialog */}
<Dialog
  open={!!deleteId}
  onClose={() => setDeleteId(null)}
>
  <DialogTitle>{t("confirmDelete")}</DialogTitle>
 
  <DialogContent>
    <Typography>
     {t("deleteMessage")}
    </Typography>
  </DialogContent>
 
  <DialogActions>
    <Button onClick={() => setDeleteId(null)}>
     {t("cancel")}
    </Button>
 
    <Button
      color="error"
      variant="contained"
      onClick={async () => {
        if (!deleteId) return;
 
        await handleDeleteDevice(deleteId);
        setDeleteId(null);
      }}
    >
     {t("delete")}
    </Button>
  </DialogActions>
</Dialog>
 
        <Container maxWidth="sm">
          <Card
            sx={{
              borderRadius: 4,
              bgcolor: "#ffffff",
              border: "1px solid rgba(15,23,42,0.08)",
              boxShadow:
                "0px 10px 30px rgba(15,23,42,0.08)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Header */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={4}
              >
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    color="#0f172a"
                  >
                   {t("title")}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="#64748b"
                  >
                    {t("subtitle")}
                  </Typography>
                </Box>
 
                <Button
                  onClick={handleAddDevice}
                  variant="contained"
                  startIcon={<AddRoundedIcon />}
                  sx={{
                    borderRadius: 2,
                    bgcolor: "#0f172a",
                    color: "white",
                    fontWeight: 600,
                    px: 2.5,
                    "&:hover": {
                      bgcolor: "#020617",
                    },
                  }}
                >
                 {t("add")}
                </Button>
              </Stack>
 
              {/* Loading */}
              {loading && (
                <Stack alignItems="center" py={6}>
                  <CircularProgress size={28} />
                </Stack>
              )}
 
              {/* Empty State */}
              {!loading && devices.length === 0 && (
                <Stack alignItems="center" spacing={2.5} py={6}>
                  <Box
                    width={64}
                    height={64}
                    borderRadius={3}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      background:
                        "linear-gradient(135deg, #e2e8f0, #f8fafc)",
                    }}
                  >
                    <WatchRoundedIcon sx={{ fontSize: 34, color: "#0f172a" }} />
                  </Box>
 
                  <Typography fontWeight={600} color="#0f172a">
                   {t("noDevices")}
                  </Typography>
 
                  <Typography variant="body2" color="#64748b">
                   {t("noDevicesSubtitle")}
                  </Typography>
 
                  <Button
                    onClick={handleAddDevice}
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 1,
                      borderRadius: 2,
                      bgcolor: "#0f172a",
                      color: "white",
                      fontWeight: 600,
                      px: 4,
                      "&:hover": {
                        bgcolor: "#020617",
                      },
                    }}
                  >
                  + {t("addDevice")}
                  </Button>
                </Stack>
              )}
 
            {/* Device List */}
{!loading && devices.length > 0 && (
  <Stack spacing={2}>
    {devices.map((d) => (
      <Card
        key={d.id}
        sx={{
          cursor: "pointer",
          borderRadius: 3,
          bgcolor: "#ffffff",
          border: "1px solid rgba(15,23,42,0.08)",
          transition: "0.25s",
          "&:hover": {
            borderColor: "#0f172a",
            boxShadow: "0px 6px 20px rgba(15,23,42,0.12)",
            transform: "translateY(-2px)",
          },
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            {/* Left */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                width={48}
                height={48}
                borderRadius={2}
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  background:
                    "linear-gradient(135deg, #e2e8f0, #f8fafc)",
                }}
              >
                <WatchRoundedIcon sx={{ color: "#0f172a" }} />
              </Box>
 
              <Box>
                <Typography color="#0f172a" fontWeight={600}>
                  {d.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="#64748b"
                  letterSpacing={1}
                >
                  {d.type.replace("_", " ")}
                </Typography>
              </Box>
            </Stack>
 
            {/* Right */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography
                variant="body2"
                color="#64748b"
                sx={{ cursor: "pointer" }}
                onClick={() => selectDevice(d.id)}
              >
               {t("select")} →
              </Typography>
 
              <DeleteOutlineRoundedIcon
                sx={{ cursor: "pointer", color: "red" }}
               onClick={() => setDeleteId(d.id)}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    ))}
  </Stack>
)}
         </CardContent>
          </Card>
        </Container>
      </Box>
    </Protected>
  );
}
 