import mongoose from "mongoose";

const treatSchema = new mongoose.Schema({
  treatmentId: { type: String, required: true, unique: true },
  doctorId: { type: Number },
  patientId: { type: Number },
  treatmentDate: Date,
  treatmentType: String,
  notes: String,
  references: {
    doctor: { doctorId: Number },
    patient: { patientId: Number }
  }
}, { timestamps: true });

const Treat = mongoose.model("Treat", treatSchema);
export default Treat;
