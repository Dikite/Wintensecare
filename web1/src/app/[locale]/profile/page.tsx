"use client";
 
import { useEffect, useState } from "react";
import Protected from "@/lib/api/protected";
import { api } from "@/lib/api/api";
 
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Container,
  CircularProgress,
  Avatar,
  Divider,
} from "@mui/material";
 
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
 
import { useTranslations } from "next-intl";
 
type User = {
  id: string;
  email: string;
  role?: string;
};
 
export default function Profile() {
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
 
  const t = useTranslations("profile");
 
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api<User>("/users/me");
        setMe(res);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
 
    loadProfile();
  }, []);
 
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
        <Container maxWidth="sm">
          <Card
            sx={{
              borderRadius: 4,
              bgcolor: "#ffffff",
              border: "1px solid rgba(15,23,42,0.08)",
              boxShadow: "0px 10px 30px rgba(15,23,42,0.08)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {loading && (
                <Stack alignItems="center" py={6}>
                  <CircularProgress size={28} />
                </Stack>
              )}
 
              {!loading && me && (
                <Stack spacing={3}>
                  {/* Avatar */}
                  <Stack alignItems="center" spacing={1}>
                    <Avatar
                      sx={{
                        width: 72,
                        height: 72,
                        bgcolor: "#0f172a",
                      }}
                    >
                      <PersonRoundedIcon fontSize="large" />
                    </Avatar>
 
                   <Typography
  variant="h6"
  fontWeight={600}
  color="#0f172a"
>
  {t("title")}
</Typography>
 
<Typography variant="body2" color="#64748b">
  {t("subtitle")}
</Typography>
                  </Stack>
 
                  <Divider />
 
                  {/* Info */}
                  <Stack spacing={2}>
                   <InfoRow label={t("userId")} value={me.id} />
<InfoRow label={t("email")} value={me.email} />
<InfoRow label={t("role")} value={me.role || t("standardUser")} />
                  </Stack>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Protected>
  );
}
 
function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Stack spacing={0.5}>
      <Typography
        variant="caption"
        fontWeight={600}
        color="#64748b"
        letterSpacing={1}
      >
        {label.toUpperCase()}
      </Typography>
 
      <Typography
        fontWeight={500}
        color="#0f172a"
        sx={{
          wordBreak: "break-all",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
 
 