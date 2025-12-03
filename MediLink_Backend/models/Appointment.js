// models/Appointment.js
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  scheduledAt: { type: Date, required: true, index: true },
  durationMinutes: { type: Number, default: 30 },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'], default: 'pending' },
  notes: { type: String },
  videoSession: { joinUrl: String, meetingId: String },
  kioskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kiosk' },
  prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' }
}, { timestamps: true });

// Index for efficient querying of appointments by doctor and date
appointmentSchema.index({ doctor: 1, scheduledAt: 1 });

// CRITICAL: Compound unique index to prevent double-booking at database level
// This is a safety net that prevents race conditions even if application logic fails
// Partial filter only applies to active appointments (not cancelled or no-show)
appointmentSchema.index(
  {
    doctor: 1,
    scheduledAt: 1,
    status: 1
  },
  {
    unique: true,
    partialFilterExpression: {
      status: { $nin: ['cancelled', 'no-show'] }
    },
    name: 'unique_active_appointment_slot'
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
