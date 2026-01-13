import express from "express";
import cors from "cors";

import telemetryRoutes from "./routes/telemetry.routes.js";
import alertRoutes from "./routes/alerts.routes.js";
import healthRoutes from "./routes/health.routes.js";
import usersRoutes from "./routes/users.routes.js";
import authRoutes from "./routes/auth.routes.js";
import devicesRoutes from "./routes/devices.routes.js";
import ecgRoutes from "./routes/vitals/ecg.routes.js";
import spo2Routes from "./routes/vitals/spo2.routes.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Core APIs
app.use("/alerts", alertRoutes);
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/telemetry", telemetryRoutes);
app.use("/health", healthRoutes);
app.use("/devices", devicesRoutes);

// Vitals
app.use("/vitals", ecgRoutes);
app.use("/vitals/spo2", spo2Routes);

export default app;
