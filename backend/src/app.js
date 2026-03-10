import express from "express";
import cors from "cors";

import telemetryRoutes from "./routes/telemetry.routes.js";
import alertRoutes from "./routes/alerts.routes.js";
import healthRoutes from "./routes/health.routes.js";
import usersRoutes from "./routes/users.routes.js";
import authRoutes from "./routes/auth.routes.js";
import devicesRoutes from "./routes/devices.routes.js";
import workoutRoutes from "./routes/workout.routes.js";
import liveRoutes from "./routes/live.routes.js";


import ecgRoutes from "./routes/vitals/ecg.routes.js";
import spo2Routes from "./routes/vitals/spo2.routes.js";
import sleepRoutes from "./routes/sleep.routes.js";
import bpRoutes from "./routes/vitals/bp.routes.js";
import temperatureRoutes from "./routes/temperature.routes.js";
import stressRoutes from "./routes/vitals/stress.routes.js";
import permissionRoutes from "./routes/permission.routes.js";
import glucoseRoutes from "./routes/vitals/glucose.routes.js";
import userDoctorRoutes from './routes/userDoctor.routes.js';


const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Core APIs
app.use("/alerts", alertRoutes);
app.use("/users", usersRoutes);
app.use("/vitals/glucose", glucoseRoutes);
app.use("/live", liveRoutes);
app.use("/auth", authRoutes);
app.use("/telemetry", telemetryRoutes);
app.use("/health", healthRoutes);
app.use("/devices", devicesRoutes);
app.use("/api/temperature", temperatureRoutes);
app.use("/workout", workoutRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/vitals/bp", bpRoutes);
app.use("/api/sleep", sleepRoutes);
app.use('/user', userDoctorRoutes);


app.use("/api/stress", stressRoutes);

// Vitals
app.use("/vitals", ecgRoutes);
app.use("/vitals/spo2", spo2Routes);

export default app;
