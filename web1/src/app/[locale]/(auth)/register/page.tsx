"use client";

import { useRouter } from "@/navigation";
import { useState } from "react";
import { api } from "@/lib/api/api";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTranslations } from "next-intl";
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Stack,
} from "@mui/material";


export default function Register() {
  const router = useRouter();
const t = useTranslations("register");
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    identifier: "",
    password: "",
    confirmPassword: "",
  });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      // ✅ register success → login
      router.replace("/login");
    } catch  {
      // ✅ already registered / validation error → login
      router.replace("/login");
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url("/images/hero-back.jpg")`,
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: 420 }}>
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


            <TextField
label={t("confirmPassword")}
  type={showConfirmPassword ? "text" : "password"}
  value={form.confirmPassword}
  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
  fullWidth
  required
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() => setShowConfirmPassword((s) => !s)}
          edge="end"
        >
          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>


            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
            >
             {t("register")}
            </Button>

            <Button
              variant="text"
              onClick={() => router.push("/login")}
            >
           {t("alreadyAccount")} {t("login")}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}