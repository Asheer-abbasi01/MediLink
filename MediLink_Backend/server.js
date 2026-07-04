// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose"; // Added for graceful shutdown

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
import noteRoutes from "./routes/noteRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Middlewares
import { errorHandler } from "./middleware/errorMiddleware.js";
import { authLimiter, apiLimiter } from "./middleware/rateLimitMiddleware.js";

dotenv.config();

const app = express();

// ----- MIDDLEWARE -----
app.use(helmet()); // basic security headers

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse form bodies
app.use(morgan(process.env.NODE_ENV === "production" ? "common" : "dev")); // logging

// Apply general API rate limiting
app.use("/api/", apiLimiter);

// ----- BASE / HEALTH CHECK -----
app.get("/", (req, res) => res.send("MediLink Backend Running..."));
app.get("/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

// ----- API ROUTES -----
// Apply specific auth rate limiting to signup/login
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", userRoutes);

// ----- 404 handler -----
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// ----- Global error handler -----
app.use(errorHandler);


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
        console.log(" HTTP server closed");

        try {
          // Close database connection
          await mongoose.connection.close();
          console.log(" Database connection closed");
          process.exit(0);
        } catch (err) {
          console.error(" Error during shutdown:", err);
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
      console.error(" Uncaught Exception:", err);
      gracefulShutdown("UNCAUGHT_EXCEPTION");
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error(" Unhandled Rejection at:", promise, "reason:", reason);
      gracefulShutdown("UNHANDLED_REJECTION");
    });

  } catch (err) {
    console.error(" Failed to start server:", err.message);
    process.exit(1);
  }
};

// Start the server
startServer();