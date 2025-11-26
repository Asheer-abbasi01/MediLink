import mongoose from "mongoose";

const diagnosisSchema = new mongoose.Schema({
  diagnosisId: { type: Number, required: true, unique: true },
  patientId: { type: Number, required: true },
  recordId: { type: Number },
  result: String,
  icdCode: String,
  severity: String,
  dateRecorded: Date,
  doctorId: Number
}, { timestamps: true });

const Diagnosis = mongoose.model("Diagnosis", diagnosisSchema);
export default Diagnosis;
