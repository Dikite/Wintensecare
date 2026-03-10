import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,

  Area,
  Legend,
} from "recharts";
import { useTranslations } from "next-intl";
import type { TelemetryPoint, TelemetryResponse } from "@/types/heart";

import { Box, useTheme, alpha, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";


import type { Range } from "@/types/heart";
import { useMediaQuery } from "@mui/material";


interface HeartChartProps {
  points: TelemetryPoint[];
  summary?: TelemetryResponse["summary"];
  range: Range;
  criticalAlertTimes: number[];
  showStats?: boolean;
  height?: number;
}



const CustomTooltip = ({ active, payload, label, range }: any) => {
    const t = useTranslations("heartChart");
  const theme = useTheme();
  
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const date = new Date(label);
    
    // Determine heart rate zone
  let zone = t("normal");
    let zoneColor = theme.palette.success.main;
    
    if (value < 60) {
     zone = t("bradycardia");
      zoneColor = theme.palette.info.main;
    } else if (value > 100) {
      zone = t("tachycardia");
      zoneColor = theme.palette.error.main;
    } else if (value > 90) {
      zone = t("elevated");
      zoneColor = theme.palette.warning.main;
    }
  
    return (
      <Box
        sx={{
          background: theme.palette.background.paper,
          p: 2,
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          maxWidth: 300,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          {range === "7d" 
            ? date.toLocaleDateString("en-GB", { 
                weekday: 'short',
                day: "2-digit", 
                month: "short",
                year: "numeric"
              })
            : date.toLocaleString("en-GB", {
                weekday: 'short',
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                day: "2-digit",
                month: "short",
              })
          }
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: theme.palette.error.main,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.error.dark }}>
         {t("bpm", { value })}
          </Typography>
        </Box>
        
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            bgcolor: alpha(zoneColor, 0.1),
            border: `1px solid ${alpha(zoneColor, 0.2)}`,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: zoneColor,
            }}
          />
          <Typography variant="caption" sx={{ color: zoneColor, fontWeight: 600 }}>
            {zone}
          </Typography>
        </Box>
        
        {value > 100 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            <WarningIcon sx={{ fontSize: 14, color: theme.palette.warning.main }} />
            <Typography variant="caption" color="text.secondary">
            {t("aboveNormal")}
            </Typography>
            
          </Box>
        )}
      </Box>
    );
  }
  return null;
};

const CustomLegend = ({ payload, summary }: any) => {
    const t = useTranslations("heartChart");
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: 3, 
      mb: 2,
      flexWrap: 'wrap'
    }}>
      {payload?.map((entry: any, index: number) => (
        <Box key={`item-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: 12, 
            height: 3, 
            bgcolor: entry.color,
            borderRadius: 1 
          }} />
          <Typography variant="caption" color="text.secondary">
            {entry.value}
          </Typography>
        </Box>
      ))}
      
      {summary && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 12, 
              height: 3, 
              bgcolor: theme.palette.success.main,
              borderRadius: 1,
              borderStyle: 'dashed',
              borderWidth: 1,
              borderColor: theme.palette.success.main
            }} />
            <Typography variant="caption" color="text.secondary">
            {t("minValue", { value: summary.minHeartRate })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 12, 
              height: 3, 
              bgcolor: theme.palette.grey[500],
              borderRadius: 1,
              borderStyle: 'dashed',
              borderWidth: 1,
              borderColor: theme.palette.grey[500]
            }} />
            <Typography variant="caption" color="text.secondary">
             {t("avg")} {summary.avgHeartRate} bpm
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              width: 12, 
              height: 3, 
              bgcolor: theme.palette.error.main,
              borderRadius: 1,
              borderStyle: 'dashed',
              borderWidth: 1,
              borderColor: theme.palette.error.main
            }} />
            <Typography variant="caption" color="text.secondary">
             {t("max")} {summary.maxHeartRate} bpm
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default function HeartChart({
  points,
  summary,
  range,
  
  criticalAlertTimes,
  showStats = true,
  height = 400,
}: HeartChartProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const processedPoints = points;
  
  // Calculate dynamic Y-axis domain
  const heartValues = points.map(p => p.heartRate);

const minHeartRate = heartValues.length
  ? Math.min(...heartValues)
  : 40;

const maxHeartRate = heartValues.length
  ? Math.max(...heartValues)
  : 160;
  const yDomain = [Math.max(30, Math.floor(minHeartRate * 0.9)), Math.min(180, Math.ceil(maxHeartRate * 1.1))];
  const t = useTranslations("heartChart");
  
  

  return (
    <Box sx={{ width: "100%",  height: "100%", overflow: "hidden" }}>
      {/* Stats Summary */}
      {showStats && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {t("current")}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.error.main }}>
                {points.length > 0 ? points[points.length - 1].heartRate : "--"} bpm
              </Typography>
            </Box>
            
          </Box>
          
        
        </Box>
      )}

      {/* Chart Container */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={processedPoints} 
          margin={{ 
            top: 10, 
            right: 80, 
            left: isMobile ? 0 : 20, 
            bottom: isMobile ? 40 : 50 
          }}
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.error.main} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={theme.palette.error.main} stopOpacity={0.1}/>
            </linearGradient>
          </defs>

          {/* Subtle grid with better spacing */}
          <CartesianGrid
            stroke={alpha(theme.palette.divider, 0.3)}
            strokeDasharray="3 3"
            vertical={false}
            strokeWidth={0.5}
          />

          {/* Heart rate zones with better visual distinction */}
          <ReferenceArea 
            y1={yDomain[0]} 
            y2={60} 
            fill={theme.palette.info.light} 
            fillOpacity={0.08} 
           label={{ value: t("bradycardia"),
              position: "insideBottomLeft", 
              fill: theme.palette.info.main,
              fontSize: 10,
              opacity: 0.7
            }}
          />
          <ReferenceArea 
            y1={60} 
            y2={100} 
            fill={theme.palette.success.light} 
            fillOpacity={0.08}
            label={{ 
          value: t("normal"),
              position: "insideTopLeft", 
              fill: theme.palette.success.main,
              fontSize: 10,
              opacity: 0.7
            }}
          />
          <ReferenceArea 
            y1={100} 
            y2={yDomain[1]} 
            fill={theme.palette.error.light} 
            fillOpacity={0.08}
            label={{ 
          value: t("tachycardia"),
              position: "insideTopLeft", 
              fill: theme.palette.error.main,
              fontSize: 10,
              opacity: 0.7
            }}
          />

          {/* X Axis with better formatting */}
        <XAxis
  dataKey="ts"
  type="number"
  scale="time"
  domain={["dataMin", "dataMax"]}
  interval="preserveStartEnd"
  minTickGap={40}
  tick={{
    fontSize: isMobile ? 10 : 12,
    fill: theme.palette.text.secondary,
  }}
  stroke={theme.palette.divider}
  tickFormatter={(t) => {
    const d = new Date(t);

    switch (range) {
      case "7d":
        return d.toLocaleDateString("en-GB", {
          weekday: "short",
        });

      case "1d":
        return d.toLocaleTimeString("en-GB", {
          hour: "2-digit",
        });

      default:
        return d.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });
    }
  }}
/>
          {/* Y Axis with better range */}
       <YAxis
  domain={yDomain}
  tick={{
    fontSize: isMobile ? 10 : 12,
    fill: theme.palette.text.secondary
  }}
  stroke={theme.palette.divider}
  unit=" bpm"
  allowDecimals={false}
/>
 
 

          {/* Enhanced Tooltip */}
          <Tooltip
            content={<CustomTooltip range={range} />}
            cursor={{ 
              stroke: theme.palette.divider, 
              strokeWidth: 1,
              strokeDasharray: "3 3" 
            }}
          />

          {/* Critical Events with better visibility */}
          {criticalAlertTimes.map((t) => (
            <ReferenceLine
              key={t}
              x={t}
              stroke={theme.palette.error.main}
              strokeDasharray="3 6"
              strokeWidth={2}
              strokeOpacity={0.7}
            />
          ))}

          {/* Summary Reference Lines */}
          {summary && (
            <>
              <ReferenceLine
                y={summary.minHeartRate}
                stroke={theme.palette.success.main}
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                 value: `${t("min")}: ${summary.minHeartRate}`,
                 
                  position: 'insideRight',
                  fill: theme.palette.success.main,
                  fontSize: 10,
                }}
              />
              <ReferenceLine
                y={summary.avgHeartRate}
                stroke={theme.palette.grey[600]}
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
               value: `${t("avg")}: ${summary.avgHeartRate}`,
                position: 'insideRight',
                  fill: theme.palette.grey[600],
                  fontSize: 10,
                }}
              />
              <ReferenceLine
                y={summary.maxHeartRate}
                stroke={theme.palette.error.main}
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                 value: `${t("max")}: ${summary.maxHeartRate}`,
                  position: 'insideRight',
                  fill: theme.palette.error.main,
                  fontSize: 10,
                }}
              />
            </>
          )}

          {/* Legend */}
         {showStats && (
  <Legend
    verticalAlign="bottom"
    align="center"
    height={36}
    wrapperStyle={{ paddingTop: 8 }}
    content={<CustomLegend summary={summary} />}
  />
)}

          {/* Area fill for better visualization */}
          <Area
            type="monotone"
            dataKey="heartRate"
            stroke="transparent"
            fill="url(#heartRateGradient)"
            fillOpacity={0.3}
          />

          {/* Heart Rate Signal Line */}
          <Line
            type="monotone"
            dataKey="heartRate"
            stroke={theme.palette.error.main}
            strokeWidth={3}
            dot={
             false
            }
            activeDot={false}
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-in-out"
          />

          
          
        </LineChart>
      </ResponsiveContainer>

      {/* Chart Footer */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mt: 2,
        pt: 2,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        flexWrap: 'wrap',
        gap: 1
      }}>
       
      
      </Box>
    </Box>
  );
}