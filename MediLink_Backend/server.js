// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose"; // Added for graceful shutdown
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
import appointmentRoutes from "./routes/appointmentRoutes.js";

// import staffRoutes from "./routes/staffRoutes.js";
// import nurseRoutes from "./routes/nurseRoutes.js";
// import recordRoutes from "./routes/recordRoutes.js";
// import diagnosisRoutes from "./routes/diagnosisRoutes.js";
// import roomRoutes from "./routes/roomRoutes.js";
// import treatRoutes from "./routes/treatRoutes.js";
// import patientRoomAssignmentRoutes from "./routes/patientRoomAssignmentRoutes.js";
// import medicinePrescriptionRoutes from "./routes/medicinePrescriptionRoutes.js";

dotenv.config();

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
app.use("/api/appointments", appointmentRoutes);


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
const startServer = async () => {
  try {
    // Wait for database connection before starting server
    await connectDB();

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown handler
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received, closing server gracefully...`);

      server.close(async () => {
        console.log("✅ HTTP server closed");

        try {
          // Close database connection
          await mongoose.connection.close();
          console.log("✅ Database connection closed");
          process.exit(0);
        } catch (err) {
          console.error("❌ Error during shutdown:", err);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error("⚠️ Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle uncaught errors
    process.on("uncaughtException", (err) => {
      console.error("💥 Uncaught Exception:", err);
      gracefulShutdown("UNCAUGHT_EXCEPTION");
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
      gracefulShutdown("UNHANDLED_REJECTION");
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

// Start the server
startServer();