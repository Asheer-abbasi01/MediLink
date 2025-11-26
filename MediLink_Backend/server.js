// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// import "express-async-errors"; // handles rejected promises in routes automatically

import connectDB from "./config/db.js";

// Only import the routes you want to test
import transactionRoutes from "./routes/transactionsRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// import staffRoutes from "./routes/staffRoutes.js";
// import nurseRoutes from "./routes/nurseRoutes.js";
// import recordRoutes from "./routes/recordRoutes.js";
// import diagnosisRoutes from "./routes/diagnosisRoutes.js";
// import roomRoutes from "./routes/roomRoutes.js";
// import treatRoutes from "./routes/treatRoutes.js";
// import patientRoomAssignmentRoutes from "./routes/patientRoomAssignmentRoutes.js";
// import medicinePrescriptionRoutes from "./routes/medicinePrescriptionRoutes.js";

dotenv.config();
connectDB(); // connect to MongoDB

const app = express();

// ----- MIDDLEWARE -----
app.use(helmet()); // basic security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*" // tighten this in production
}));
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse form bodies
app.use(morgan(process.env.NODE_ENV === "production" ? "common" : "dev")); // logging

// ----- BASE / HEALTH CHECK -----
app.get("/", (req, res) => res.send("MediLink Backend Running..."));
app.get("/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

// ----- API ROUTES -----
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/transactions", transactionRoutes);


// ----- 404 handler -----
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// ----- Global error handler -----
app.use((err, req, res, next) => {
  console.error(err); // log to console (or better: log file in prod)
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
});

// ----- START SERVER -----
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Graceful shutdown (optional but recommended)
process.on("SIGTERM", () => {
  console.info("SIGTERM received, closing server...");
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});