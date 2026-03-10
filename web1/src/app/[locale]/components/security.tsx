// app/security/page.tsx
"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  alpha,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import SecurityIcon from "@mui/icons-material/Security";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const SecurityPage: React.FC = () => {

  const features = [
    {
      icon: <LockIcon sx={{ fontSize: 40 }} />,
      title: "End-to-End Encryption",
      description:
        "Your health data is encrypted in transit and at rest for maximum security.",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: "Strict Access Control",
      description:
        "Only you decide who can access your data—complete privacy guaranteed.",
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
      title: "Compliance Standards",
      description:
        "We comply with global healthcare security regulations and standards.",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: { xs: 8, md: 12 },
        backgroundImage: "url('/images/security-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        color: "#fff",
      }}
    >
      {/* Overlay with gradient */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.85) 100%)",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        {/* Heading */}
        <Typography
          variant="h4"
          align="center"
          fontWeight={800}
          gutterBottom
          sx={{
            color: "#fff",
            textShadow: "0px 4px 15px rgba(0,0,0,0.6)",
          }}
        >
          Your Data is <span style={{ color: "#FFD700" }}>100% Secure</span> and
          Private
        </Typography>

        {/* Subheading */}
        <Typography
          variant="h6"
          align="center"
          sx={{
            maxWidth: "760px",
            mx: "auto",
            color: alpha("#fff", 0.85),
            mb: 8,
            fontWeight: 400,
            lineHeight: 1.6,
          }}
        >
          We treat your health data with the utmost care. Our platform employs
          end-to-end encryption, strict access controls, and complies with
          global medical data security standards. You have full control over who
          sees your information—only those you explicitly approve.
        </Typography>

        {/* Features */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
        >
          {features.map((feature, idx) => (
            <Paper
              key={idx}
              elevation={0}
              sx={{
                flex: 1,
                p: 5,
                textAlign: "center",
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.06)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                transition: "all 0.35s ease",
                "&:hover": {
                  transform: "translateY(-12px) scale(1.02)",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255, 215, 0, 0.6)",
                  background: "rgba(255, 255, 255, 0.12)",
                },
              }}
            >
              {/* Icon with circular glow */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "rgba(255, 215, 0, 0.15)",
                  boxShadow: "0 0 20px rgba(255, 215, 0, 0.4)",
                  mb: 2,
                  mx: "auto",
                  color: "#FFD700",
                }}
              >
                {feature.icon}
              </Box>

              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ color: "#FFD700", mb: 1 }}
              >
                {feature.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: alpha("#fff", 0.85), lineHeight: 1.6 }}
              >
                {feature.description}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default SecurityPage;
