'use client';

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';
import { useTranslations } from "next-intl";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const t = useTranslations("forgotPassword");
  const theme = useTheme();
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');

const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `
          linear-gradient(135deg,
            ${alpha(theme.palette.primary.main, 0.25)},
            ${alpha(theme.palette.secondary.main, 0.15)}
          ),
          url('/images/hero-back.jpg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background Glow */}
      <Box
        sx={{
          position: 'absolute',
          width: 520,
          height: 520,
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            0.35
          )} 0%, transparent 70%)`,
          filter: 'blur(130px)',
          bottom: -150,
          right: -150,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <Paper
          elevation={16}
          sx={{
            width: '100%',
            maxWidth: 440,
            p: 4,
            borderRadius: 4,
            backgroundColor: alpha(theme.palette.background.paper, 0.88),
            backdropFilter: 'blur(18px)',
            boxShadow: `0 30px 80px ${alpha('#000', 0.35)}`,
          }}
        >
          {/* ================= STEP 1: EMAIL ================= */}
          {step === 'email' && (
            <Stack spacing={3}>
              <Typography variant="h4" fontWeight={800} textAlign="center">
              {t("title")}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
               {t("emailInstruction")}
              </Typography>

              <TextField
              label={t("email")}
                type="email"
                fullWidth
                required
              />

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    py: 1.4,
                    fontWeight: 700,
                    borderRadius: 3,
                  }}
                  onClick={() => setStep('otp')}
                >
                 {t("sendOtp")}
                </Button>
              </motion.div>

              <Button href="/login" variant="text" fullWidth>
               {t("verifyTitle")}
              </Button>
            </Stack>
          )}

          {/* ================= STEP 2: OTP ================= */}
          {step === 'otp' && (
            <Stack spacing={3}>
              <Typography variant="h4" fontWeight={800} textAlign="center">
              {t("resetTitle")}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Enter the OTP sent to your email
              </Typography>

              <TextField
                label="Enter OTP"
                inputProps={{ maxLength: 6 }}
                fullWidth
                required
              />

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    py: 1.4,
                    fontWeight: 700,
                    borderRadius: 3,
                  }}
                  onClick={() => setStep('reset')}
                >
                  Verify OTP
                </Button>
              </motion.div>

              <Stack direction="row" justifyContent="space-between">
                <Button variant="text" onClick={() => setStep('email')}>
                  Change Email
                </Button>

                <Button variant="text">
                  Resend OTP
                </Button>
              </Stack>
            </Stack>
          )}

          {/* ================= STEP 3: RESET PASSWORD ================= */}
          {step === 'reset' && (
            <Stack spacing={3}>
              <Typography variant="h4" fontWeight={800} textAlign="center">
                Reset Password
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Create a new secure password
              </Typography>

             <TextField
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              fullWidth
              required
              InputProps={{
              endAdornment: (
             <InputAdornment position="end">
            <IconButton onClick={() => setShowNewPassword((s) => !s)} edge="end">
            {showNewPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
            </InputAdornment>
         ),
         }}
        />


              <TextField
  label="Confirm Password"
  type={showConfirmPassword ? "text" : "password"}
  fullWidth
  required
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowConfirmPassword((s) => !s)} edge="end">
          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>


              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    py: 1.4,
                    fontWeight: 700,
                    borderRadius: 3,
                  }}
                >
                  Update Password
                </Button>
              </motion.div>

              <Button href="/login" variant="text" fullWidth>
                Back to Login
              </Button>
            </Stack>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
}
