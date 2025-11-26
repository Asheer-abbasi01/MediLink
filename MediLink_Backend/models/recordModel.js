import mongoose from "mongoose";

const diagnosisSummarySchema = new mongoose.Schema({
  diagnosisId: Number,
  result: String,
  severity: String
}, { _id: false });

const recordSchema = new mongoose.Schema({
  recordId: { type: Number, required: true, unique: true },
  patientId: { type: Number, required: true },
  doctorId: { type: Number },
  dateAdmitted: Date,
  dateDischarged: Date,
  treatment: String,
  diagnosisSummary: [diagnosisSummarySchema],
  notes: String,
  references: {
    patient: { patientId: Number },
    doctor: { doctorId: Number }
  }
}, { timestamps: true });

const Record = mongoose.model("Record", recordSchema);
export default Record;
