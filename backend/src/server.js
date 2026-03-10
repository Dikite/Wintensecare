import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

/* ================= HTTP SERVER ================= */
const server = http.createServer(app);

/* ================= SOCKET.IO ================= */
export const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("✅ socket connected:", socket.id);

  let currentDevice = null;

  /* -------- JOIN DEVICE -------- */
  socket.on("join-device", (deviceId) => {
    if (currentDevice) {
      socket.leave(currentDevice);
      console.log("Left:", currentDevice);
    }

    socket.join(deviceId);
    currentDevice = deviceId;

    console.log("Joined:", deviceId);
  });

  /* -------- LEAVE DEVICE -------- */
  socket.on("leave-device", (deviceId) => {
    socket.leave(deviceId);
    console.log("Explicit leave:", deviceId);
  });

  socket.on("disconnect", () => {
    console.log("❌ socket disconnected");
  });
});

/* ================= START ================= */
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});