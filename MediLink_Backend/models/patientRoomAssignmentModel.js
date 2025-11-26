const mongoose = require("mongoose");

const patientRoomAssignmentSchema = new mongoose.Schema({
  assignmentId: { type: Number, required: true, unique: true },
  patientId: { type: Number, required: true },
  roomId: { type: Number },
  admissionDate: Date,
  dischargeDate: Date,
  reason: String,
  status: String,
  references: {
    room: { roomId: Number },
    patient: { patientId: Number },
  },
}, { timestamps: true });

module.exports = mongoose.model("PatientRoomAssignment", patientRoomAssignmentSchema);
