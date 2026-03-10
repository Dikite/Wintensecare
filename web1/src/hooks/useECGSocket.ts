"use client";
 
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
 
/* =====================================================
   CONFIG
===================================================== */
 
const FIVE_MIN = 5 * 60 * 1000;
const MAX_QUEUE = 5000;
const BATCH_SIZE = 5;
const SIGNAL_TIMEOUT = 1500;
 
type ECGPoint = {
  t: number;
  v: number;
};
 
export function useECGSocket(deviceId: string | null) {
  const [points, setPoints] = useState<ECGPoint[]>([]);
  const [hasSignal, setHasSignal] = useState(false);
 
  const socketRef = useRef<Socket | null>(null);
  const queueRef = useRef<number[]>([]);
  const batchRef = useRef<ECGPoint[]>([]);
  const rafRef = useRef<number | null>(null);
  const currentDeviceRef = useRef<string | null>(null);
  const lastSignalTimeRef = useRef<number>(0);
 
  /* =====================================================
     CREATE SOCKET (RUN ONCE)
  ===================================================== */
  useEffect(() => {
    const socket = io("http://localhost:4000", {
      transports: ["websocket"],
    });
 
    socketRef.current = socket;
 
    socket.on("connect", () => {
      console.log("✅ ECG socket connected");
    });
 
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);
 
  /* =====================================================
     DEVICE JOIN / SWITCH  ✅ FIXED (NO RACE CONDITION)
  ===================================================== */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !deviceId) return;
 
    const tryJoin = () => {
      if (!socket.connected) return;
 
      console.log("➡️ Joining ECG device:", deviceId);
 
      // leave previous device
      if (currentDeviceRef.current) {
        socket.emit("leave-device", currentDeviceRef.current);
      }
 
      currentDeviceRef.current = deviceId;
 
      // reset buffers
      setPoints([]);
      queueRef.current = [];
      batchRef.current = [];
      lastSignalTimeRef.current = 0;
      setHasSignal(false);
 
      socket.emit("join-device", deviceId);
    };
 
    // attempt immediately
    tryJoin();
 
    // retry when socket connects (StrictMode safe)
    socket.on("connect", tryJoin);
 
    return () => {
      socket.off("connect", tryJoin);
    };
  }, [deviceId]);
 
  /* =====================================================
     RECEIVE ECG DATA
  ===================================================== */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
 
    const handler = (d: any) => {
      if (!d?.measuredAt || !Array.isArray(d.signal)) return;
 
      const measured = new Date(d.measuredAt).getTime();
      if (Date.now() - measured > FIVE_MIN) return;
 
      // enqueue samples
      queueRef.current.push(...d.signal);
 
      lastSignalTimeRef.current = Date.now();
      setHasSignal(true);
 
      // prevent memory explosion
      if (queueRef.current.length > MAX_QUEUE) {
        queueRef.current.splice(
          0,
          queueRef.current.length - MAX_QUEUE
        );
      }
    };
 
    socket.off("ecg-update");
    socket.on("ecg-update", handler);
 
    return () => {
      socket.off("ecg-update", handler);
    };
  }, []);
 
  /* =====================================================
     SMOOTH ICU PLAYBACK (requestAnimationFrame)
  ===================================================== */
  useEffect(() => {
    const playback = () => {
      const now = Date.now();
 
      if (queueRef.current.length) {
        const next = queueRef.current.shift()!;
 
        batchRef.current.push({
          v: next,
          t: now,
        });
 
        if (batchRef.current.length >= BATCH_SIZE) {
          setPoints(prev => {
            const updated = [...prev, ...batchRef.current];
            batchRef.current = [];
 
            return updated.filter(p => now - p.t <= FIVE_MIN);
          });
        }
      }
 
      // detect signal loss
      if (
        hasSignal &&
        now - lastSignalTimeRef.current > SIGNAL_TIMEOUT
      ) {
        setHasSignal(false);
      }
 
      rafRef.current = requestAnimationFrame(playback);
    };
 
    rafRef.current = requestAnimationFrame(playback);
 
    return () => {
      if (rafRef.current)
        cancelAnimationFrame(rafRef.current);
    };
  }, [hasSignal]);
 
  /* ===================================================== */
 
  return {
    points,
    hasSignal,
  };
}
 