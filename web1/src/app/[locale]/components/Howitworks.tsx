"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import { Box, Typography, Stack, Paper, alpha, Button } from "@mui/material";
import { FaCube } from "react-icons/fa";

// Placeholder 3D watch
function Watch3D() {
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh>
        <torusKnotGeometry args={[1, 0.25, 128, 32]} />
        <meshStandardMaterial
          color="#4A4A4A"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>
    </Float>
  );
}

const steps = [
  {
    icon: <FaCube size={24} color="#C0A060" />,
    title: "Connect & Setup",
    description:
      "Quickly unbox your watch and pair with the app for instant setup.",
  },
  {
    icon: <FaCube size={24} color="#C0A060" />,
    title: "Monitor Health",
    description:
      "Track heart rate, activity, and sleep continuously with precision.",
  },
  {
    icon: <FaCube size={24} color="#C0A060" />,
    title: "Receive Alerts",
    description:
      "Get notified instantly when unusual activity or vital signs are detected.",
  },
  {
    icon: <FaCube size={24} color="#C0A060" />,
    title: "Take Action & Share",
    description:
      "View insights, share with your doctor, or request help with a tap.",
  },
];

export default function HowItWorksSection() {
  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        px: { xs: 3, md: 12 },
        background: "linear-gradient(180deg, #F9F9F9 0%, #FFFFFF 100%)",
        color: "#333",
      }}
    >
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 900,
            mb: 8,
            fontSize: { xs: "2.2rem", md: "3rem" },
            background: "linear-gradient(90deg, #FFD700, #C0A060)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          How It Works
        </Typography>
      </motion.div>

      {/* 3D Watch + Steps */}
      <Stack
        direction={{ xs: "column-reverse", md: "row" }}
        spacing={8}
        alignItems="center"
        justifyContent="center"
      >
        {/* Steps */}
        <Stack spacing={4} sx={{ width: { xs: "100%", md: "45%" } }}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.25, duration: 0.6 }}
            >
              <Paper
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  p: 4,
                  borderRadius: 4,
                  background: alpha("#ffffff", 0.6),
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
                  },
                }}
              >
                {step.icon}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1, color: "#C0A060" }}
                  >
                    {step.title}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.85 }}>
                    {step.description}
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          ))}
        </Stack>

        {/* 3D Watch + View 3D CTA */}
        <Box
          sx={{
            position: "relative",
            width: { xs: "100%", md: "50%" },
            height: { xs: 300, md: 500 },
            borderRadius: 6,
            overflow: "hidden",
            boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
          }}
        >
          <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <Environment preset="studio" />
            <Watch3D />
            <OrbitControls enableZoom={false} />
          </Canvas>

          {/* View 3D Watch Button */}
          <Box
            sx={{
              position: "absolute",
              top: "90%",
              right: -20,
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              startIcon={<FaCube />}
              sx={{
                backgroundColor: "#C0A060",
                color: "#fff",
                px: 3,
                py: 1.5,
                fontWeight: 700,
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                "&:hover": {
                  backgroundColor: "#FFD700",
                  color: "#333",
                },
              }}
            >
              View 3D Watch
            </Button>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
