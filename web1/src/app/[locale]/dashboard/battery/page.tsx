"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/api";


/* ================= TYPES ================= */


type TelemetryHistoryResponse = {
  range: string;
 
  summary: {
    battery: number;
  };
};

type TelemetryItem = {
  battery: number;
  createdAt: string;
};

/* ================= PAGE ================= */

export default function BatteryPage() {
  const [history, setHistory] =
    useState<TelemetryHistoryResponse | null>(null);

  const [currentBattery, setCurrentBattery] =
    useState<number | null>(null);

  const [lastUpdated, setLastUpdated] =
    useState<string>("--");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const deviceId = localStorage.getItem("deviceId");
    if (!deviceId) return;

    /* ===== FETCH HISTORY (for chart) ===== */
    async function loadHistory() {
      try {
        const res = await api<TelemetryHistoryResponse>(
          `/telemetry/history?deviceId=${deviceId}&range=1h`
        );
        setHistory(res);
        setLoading(false);
      } catch (e) {
        console.error("Failed to load battery history", e);
      }
    }

    /* ===== FETCH CURRENT (latest telemetry) ===== */
    async function loadCurrent() {
      try {
        const res = await api<TelemetryItem[]>(
          `/telemetry?deviceId=${deviceId}`
        );

        const latest = res.at(-1);
        if (latest) {
          setCurrentBattery(latest.battery);
          setLastUpdated(
            new Date(latest.createdAt).toLocaleTimeString("en-GB", {
              hour12: false,
            })
          );
        }
      } catch (e) {
        console.error("Failed to load current battery", e);
      }
    }

    // initial load
    loadHistory();
    loadCurrent();

    // live polling
    const timer = setInterval(() => {
      loadHistory();
      loadCurrent();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  /* ================= UI ================= */

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        background: "#ffffff",
        color: "#111827",
      }}
    >
      <h2 style={{ marginBottom: 12 }}>🔋 Battery</h2>

      {loading && <p>Loading…</p>}

      {!loading && history && (
        <>
          {/* ===== CURRENT BATTERY ===== */}
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              marginBottom: 16,
              maxWidth: 420,
            }}
          >
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              Current Battery
            </div>

            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color:
                  currentBattery !== null && currentBattery <= 20
                    ? "#dc2626"
                    : "#16a34a",
              }}
            >
              {currentBattery ?? "--"}%
            </div>

            <div style={{ fontSize: 12, color: "#6b7280" }}>
              Last updated: {lastUpdated}
            </div>
          </div>

          {/* ===== BATTERY HISTORY ===== */}
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Battery History (Last 1 Hour)
            </div>

        
          </div>
        </>
      )}
    </div>
  );
}
