"use client";
 
import { useEffect, useState } from "react";
import Protected from "@/lib/api/protected";
import { fetchPermissions, updatePermissions } from "@/lib/api/permissions";
 
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Switch,
  CircularProgress,
  Container,
  Divider,
} from "@mui/material";
 
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
 
import { useTranslations } from "next-intl";
 
export default function Permissions() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
 
  const t = useTranslations("permissions");
 
  useEffect(() => {
    async function load() {
      try {
        const res = await fetchPermissions();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
 
    load();
  }, []);
 
  const toggle = async (key: string, value: boolean) => {
    const updated = await updatePermissions({ [key]: value });
    setData(updated);
  };
 
  return (
    <Protected>
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          background: "#020617",
        }}
      >
        <Container maxWidth="sm">
          <Card
            sx={{
              borderRadius: 4,
              bgcolor: "#020617",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0px 10px 40px rgba(0,0,0,0.6)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Header */}
              <Stack direction="row" spacing={2} alignItems="center" mb={4}>
                <Box
                  width={44}
                  height={44}
                  borderRadius={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  <SecurityRoundedIcon sx={{ color: "#fff" }} />
                </Box>
 
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    color="#fff"
                  >
                   {t("title")}
                  </Typography>
 
                  <Typography
                    variant="body2"
                    color="rgba(255,255,255,0.5)"
                  >
                    {t("subtitle")}
                  </Typography>
                </Box>
              </Stack>
 
              {loading && (
                <Stack alignItems="center" py={6}>
                  <CircularProgress size={26} />
                </Stack>
              )}
 
              {!loading && data && (
                <Stack spacing={2}>
                  {[
  ["allowAlerts", t("criticalAlerts")],
  ["allowBackground", t("backgroundMonitoring")],
  ["allowCloudSync", t("cloudSync")],
  ["allowAnalytics", t("analyticsUsage")],
  ["autoConnect", t("autoConnect")],
].map(([key, label]) => (
                    <Box key={key}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        py={1.5}
                      >
                        <Box>
                          <Typography color="#fff" fontWeight={500}>
                            {label}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="rgba(255,255,255,0.4)"
                          >
                            {getDescription(key as string, t)}
                          </Typography>
                        </Box>
 
                        <Switch
                          checked={data[key]}
                          onChange={(e) =>
                            toggle(key as string, e.target.checked)
                          }
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#fff",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                bgcolor: "#fff",
                              },
                          }}
                        />
                      </Stack>
 
                      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
                    </Box>
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
 
function getDescription(key: string, t: any) {
  switch (key) {
    case "allowAlerts":
      return t("descCriticalAlerts");
    case "allowBackground":
      return t("descBackgroundMonitoring");
    case "allowCloudSync":
      return t("descCloudSync");
    case "allowAnalytics":
      return t("descAnalyticsUsage");
    case "autoConnect":
      return t("descAutoConnect");
    default:
      return "";
  }
}
 