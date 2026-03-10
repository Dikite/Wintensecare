"use client";
 
import React, { useMemo } from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { SleepSession } from "@/types/sleep";
import { useTranslations } from "next-intl";
 
export default function SleepRatioDonut({
  latestSleep,
}: {
  latestSleep: SleepSession | null;
}) {
 
  const t = useTranslations("sleep");
 
  const data = useMemo(() => {
    if (!latestSleep) return [];
 
    return [
     {
  name: t("deep"),
  value: latestSleep.deepMinutes || 0,
  color: "#6d28d9"
},
{
  name: t("light"),
  value: latestSleep.lightMinutes || 0,
  color: "#a855f7"
},
{
  name: t("rem"),
  value: latestSleep.remMinutes || 0,
  color: "#60a5fa"
},
{
  name: t("awake"),
  value: latestSleep.awakeMinutes || 0,
  color: "#f59e0b"
},
    ].filter((x) => x.value > 0);
  }, [latestSleep,t]);
 
  const total = data.reduce((sum, x) => sum + x.value, 0);
 
 
 
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ height: 220, position: "relative" }}>
        {total === 0 ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography fontSize={13} color="text.secondary">
              {t("noRatioData")}
            </Typography>
          </Box>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
 
            {/* center text */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                pointerEvents: "none",
              }}
            >
              <Typography fontSize={12} color="text.secondary">
                {t("sleepRatio")}
              </Typography>
              <Typography fontSize={20} fontWeight={900}>
                {Math.round(total / 60)}h
              </Typography>
            </Box>
          </>
        )}
      </Box>
 
      {/* ✅ neat legend */}
      {total > 0 && (
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          justifyContent="center"
          sx={{ mt: 1 }}
        >
          {data.map((x) => (
            <Chip
              key={x.name}
              label={`${x.name} ${Math.round((x.value / total) * 100)}%`}
              size="small"
              sx={{
                fontWeight: 800,
                bgcolor: `${x.color}22`,
                color: x.color,
                border: `1px solid ${x.color}55`,
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
 
 