"use client";
import { Box } from "@mui/material";

export default function MovingBackground() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",

        /* ===== DARK MEDICAL BASE ===== */
          background: "#bed6ea",

        /* ================= HEX AI PATTERN ================= */
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          opacity: 0.12,

          backgroundImage: `
            linear-gradient(60deg, rgba(0,255,200,0.35) 1px, transparent 1px),
            linear-gradient(120deg, rgba(0,255,200,0.35) 1px, transparent 1px),
            linear-gradient(0deg, rgba(0,180,255,0.25) 1px, transparent 1px)
          `,
          backgroundSize: "48px 84px",
          animation: "hexMove 90s linear infinite",
        },

        /* ================= DNA HELIX ================= */
        "& .dna": {
          position: "absolute",
          top: "20%",
          left: "-20%",
          width: "140%",
          height: "200px",
          opacity: 0.22,
          animation: "dnaMove 50s linear infinite",
          filter: "blur(0.3px)",
        },

        /* ================= ECG WAVE ================= */
        "& .heartbeat-wave": {
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          background: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 140px,
            rgba(0,255,200,0.5) 144px,
            transparent 150px
          )`,
          backgroundSize: "700px 100%",
          animation: "waveMove 22s linear infinite",
        },

        /* ================= DEPTH GLOW ================= */
        "& .vitals-glow": {
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 30% 30%, rgba(0,255,200,0.15), transparent 60%),
            radial-gradient(circle at 70% 70%, rgba(0,180,255,0.12), transparent 60%)
          `,
          animation: "pulse 18s ease-in-out infinite",
        },

        /* ================= SCAN LINE ================= */
        "& .scan": {
          position: "absolute",
          left: 0,
          right: 0,
          height: "2px",
          opacity: 0.4,
          background:
            "linear-gradient(90deg, transparent, rgba(0,255,200,0.9), transparent)",
          animation: "scan 10s linear infinite",
        },

        /* ================= EDGE VIGNETTE ================= */
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at center, transparent 55%, rgba(0,0,0,0.6) 100%)",
        },

        /* ================= ANIMATIONS ================= */
        "@keyframes hexMove": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "350px 350px" },
        },

        "@keyframes dnaMove": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(45%)" },
        },

        "@keyframes waveMove": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "-700px 0" },
        },

        "@keyframes pulse": {
          "0%,100%": { opacity: 0.6 },
          "50%": { opacity: 1 },
        },

        "@keyframes scan": {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },

        "@media (prefers-reduced-motion: reduce)": {
          "&::before, & .dna, & .heartbeat-wave, & .vitals-glow, & .scan": {
            animation: "none",
          },
        },
      }}
    >
      {/* DNA HELIX */}
      <svg className="dna" viewBox="0 0 800 200" preserveAspectRatio="none">
        <path
          d="M0,100 C100,20 200,180 300,100 400,20 500,180 600,100 700,20 800,180 900,100"
          stroke="rgba(0,255,200,0.8)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M0,100 C100,180 200,20 300,100 400,180 500,20 600,100 700,180 800,20 900,100"
          stroke="rgba(0,180,255,0.8)"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      <div className="heartbeat-wave" />
      <div className="vitals-glow" />
      <div className="scan" />
    </Box>
  );
}
