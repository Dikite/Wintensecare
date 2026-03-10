"use client";
 
import React, { useMemo } from "react";
import { Box, Typography, alpha, useTheme } from "@mui/material";
import type { SleepSession } from "@/types/sleep";
 
import { useTranslations } from "next-intl";
 
type Stage = "deep" | "light" | "rem" | "awake";
 
type Block = {
  start: Date;
  end: Date;
  stage: Stage;
};
 
function addMinutes(d: Date, mins: number) {
  return new Date(d.getTime() + mins * 60 * 1000);
}
 
function fmtTime(d: Date) {
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
 
export default function SleepTimeline1D({
  latestSleep,
}: {
  latestSleep: SleepSession | null;
}) {
  const theme = useTheme();
  const t = useTranslations("sleep");
 
  const blocks = useMemo(() => {
    if (!latestSleep) return [];
 
    const start = new Date(latestSleep.startTime);
 
    const deep = latestSleep.deepMinutes || 0;
    const light = latestSleep.lightMinutes || 0;
    const rem = latestSleep.remMinutes || 0;
    const awake = latestSleep.awakeMinutes || 0;
 
   
 
    // ✅ FIX: stage is now union type (not string)
    const stages = [
      { stage: "light", mins: light },
      { stage: "deep", mins: deep },
      { stage: "rem", mins: rem },
      { stage: "awake", mins: awake },
    ] as const;
 
    const filtered = stages.filter((x) => x.mins > 0);
 
    let cursor = start;
    const out: Block[] = [];
 
    for (const s of filtered) {
      const end = addMinutes(cursor, s.mins);
      out.push({ start: cursor, end, stage: s.stage });
      cursor = end;
    }
 
    return out;
  }, [latestSleep]);
 
  const totalMins = useMemo(() => {
    if (!latestSleep) return 0;
    return (
      (latestSleep.deepMinutes || 0) +
      (latestSleep.lightMinutes || 0) +
      (latestSleep.remMinutes || 0) +
      (latestSleep.awakeMinutes || 0)
    );
  }, [latestSleep]);
 
  const colorFor = (stage: Stage) => {
    switch (stage) {
      case "deep":
        return "#6d28d9";
      case "light":
        return "#a855f7";
      case "rem":
        return "#60a5fa";
      case "awake":
        return "#f59e0b";
    }
  };
 
  if (!latestSleep || totalMins === 0) {
    return (
      <Box
        sx={{
          height: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography fontSize={13} color="text.secondary">
         {t("noSleepSession")}
        </Typography>
      </Box>
    );
  }
 
  return (
    <Box sx={{ width: "100%" }}>
      {/* Timeline bar */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: 46,
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
        }}
      >
        {blocks.map((b, idx) => {
          const widthPct =
            (b.end.getTime() - b.start.getTime()) / (totalMins * 60 * 1000);
 
          return (
            <Box
              key={idx}
              title={`${b.stage.toUpperCase()} • ${fmtTime(b.start)} - ${fmtTime(
                b.end
              )}`}
              sx={{
                width: `${widthPct * 100}%`,
                bgcolor: colorFor(b.stage),
                transition: "width 0.4s ease",
              }}
            />
          );
        })}
      </Box>
 
      {/* Labels */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Typography fontSize={12} color="text.secondary">
          {fmtTime(new Date(latestSleep.startTime))}
        </Typography>
        <Typography fontSize={12} color="text.secondary">
          {fmtTime(new Date(latestSleep.endTime))}
        </Typography>
      </Box>
 
      {/* Legend */}
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 1.5 }}>
        {(["deep", "light", "rem", "awake"] as const).map((s) => (
          <Box key={s} sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: 99,
                bgcolor: colorFor(s),
              }}
            />
            <Typography fontSize={12} color="text.secondary" sx={{ fontWeight: 600 }}>
              {t(s)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
 
 