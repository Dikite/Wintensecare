"use client";
import { useRouter, Link } from "@/navigation";
import { useState } from "react";

import { api } from "@/lib/api/api";
import { saveToken } from "@/lib/api/auth";
import { useTranslations } from "next-intl";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Stack,
} from "@mui/material";

type LoginResponse = {
  accessToken: string;
};

export default function Login() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await api<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      // ✅ store token once
      saveToken(res.accessToken);

      // ✅ ALWAYS go to dashboard
     router.replace({ pathname: "/dashboard" });
    } catch {
      alert(t("invalidCredentials"));
    }
  }
  const t = useTranslations("login");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url("/images/hero-back.jpg")`,
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper sx={{ p: 4, width: 420 }}>
        <form onSubmit={submit}>
          <Stack spacing={3}>
            <Typography variant="h5" textAlign="center">
            {t("title")}
            </Typography>

            <TextField
             label={t("identifier")}
              value={form.identifier}
              onChange={(e) =>
                setForm({ ...form, identifier: e.target.value })
              }
              fullWidth
              required
            />

           <TextField
label={t("password")}
  type={showPassword ? "text" : "password"}
  value={form.password}
  onChange={(e) => setForm({ ...form, password: e.target.value })}
  fullWidth
  required
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>


            <Button variant="contained" type="submit" fullWidth>
            {t("login")}
            </Button>

            <Button variant="text" component={Link} href="/forgot-password">
            {t("forgotPassword")}
            </Button>

            <Button variant="text" onClick={() => router.push("/register")}>
             {t("createAccount")}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
