// routes/appointmentRoutes.js
import express from "express";
import {
    createAppointment,
    getAppointmentsByUser,
    getAppointmentsByDoctor,
    getAvailableSlots,
    updateAppointmentStatus,
    getAppointmentById,
    deleteAppointment,
    getAllAppointments
} from "../controllers/appointmentController.js";

const router = express.Router();

// Create new appointment
router.post("/", createAppointment);

// Get all appointments (Admin)
router.get("/", getAllAppointments);

// Get available time slots for a doctor on a specific date
router.get("/available-slots/:doctorId/:date", getAvailableSlots);

// Get appointments by user (patient)
router.get("/user/:userId", getAppointmentsByUser);

// Get appointments by doctor
router.get("/doctor/:doctorId", getAppointmentsByDoctor);

// Get single appointment
router.get("/:id", getAppointmentById);

// Update appointment status
router.put("/:id/status", updateAppointmentStatus);

// Cancel appointment
router.delete("/:id", deleteAppointment);

export default router;
