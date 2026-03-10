"use client";

import React from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

/* ---------------- styled components (NO sx) ---------------- */

const Section = styled("section")<{ bg: string }>(({ bg }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "relative",
  overflow: "hidden",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundImage: bg,
}));

const Overlay = styled("div")({
  position: "absolute",
  inset: 0,
  zIndex: 1,
});

const ImageWrap = styled("div")({
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  zIndex: 2,
});

const Glow = styled("div")<{ color: string }>(({ color }) => ({
  position: "absolute",
  width: "80%",
  height: "80%",
  borderRadius: "50%",
  filter: "blur(50px)",
  background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
  zIndex: -1,
}));

/* ---------------- component ---------------- */

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const backgroundImage = `
    linear-gradient(
      135deg,
      ${alpha(theme.palette.background.default, 0.4)} 0%,
      ${alpha(theme.palette.primary.light, 0.1)} 100%
    ),
    url("/images/hero-back.jpg")
  `;

  return (
    <Section bg={backgroundImage}>
      <Overlay
        style={{
          backgroundColor: alpha(theme.palette.background.default, 0.65),
        }}
      />

      {/* TEXT CONTENT */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          flex: 1,
          zIndex: 2,
          padding: isMobile ? "48px 24px" : "0 96px",
        }}
      >
        <Typography
          variant="h1"
          fontWeight={800}
          mb={3}
          lineHeight={1.2}
          color="text.primary"
          sx={{
            fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.5rem" },
            textShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          Connect and Protect Your Loved Ones.
        </Typography>

        <Typography
          variant="h6"
          mb={5}
          lineHeight={1.7}
          color="text.secondary"
          sx={{
            fontSize: { xs: "1rem", md: "1.25rem" },
            maxWidth: "90%",
          }}
        >
          Real-time health monitoring and alerts that bring peace of mind to
          families, employees, and entire communities.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.6,
              borderRadius: "50px",
              fontWeight: 700,
              fontSize: "1.1rem",
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 10px 28px rgba(0,0,0,0.35)",
              },
            }}
          >
            Order Your RHM Device
          </Button>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              sx={{
                px: 3,
                py: 1.3,
                borderRadius: "50px",
                fontWeight: 600,
                borderColor: alpha(theme.palette.primary.main, 0.4),
                backgroundColor: alpha(theme.palette.background.paper, 0.5),
                backdropFilter: "blur(12px)",
              }}
            >
              Learn More
            </Button>

            <Button
              component={Link}
              href="/en/login"
              variant="text"
              color="secondary"
              sx={{
                px: 3,
                py: 1.3,
                borderRadius: "50px",
                fontWeight: 600,
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Already a User? Log In
            </Button>
          </Stack>
        </Stack>
      </motion.div>

      {/* IMAGE / VISUAL */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9 }}
        style={{
          flex: 1,
          maxWidth: isMobile ? "100%" : "50%",
          zIndex: 2,
        }}
      >
        <ImageWrap>
          <img
            src="/images/family-watch.png"
            alt="Family wearing health watch"
            style={{
              width: "100%",
              maxWidth: 420,
              borderRadius: 12,
              boxShadow: "0 10px 32px rgba(0,0,0,0.25)",
              transform: "rotate(-4deg)",
              backgroundColor: alpha(theme.palette.background.paper, 0.15),
              backdropFilter: "blur(8px)",
            }}
          />

          {!isMobile && (
            <img
              src="/images/watch-app.png"
              alt="Health monitoring app"
              style={{
                position: "absolute",
                width: "40%",
                maxWidth: 190,
                bottom: 40,
                right: 40,
                borderRadius: 8,
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                transform: "rotate(6deg)",
              }}
            />
          )}

          <Glow color={alpha(theme.palette.primary.main, 0.15)} />
        </ImageWrap>
      </motion.div>
    </Section>
  );
};

export default HeroSection;
