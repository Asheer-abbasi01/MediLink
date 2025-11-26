import mongoose from "mongoose";

const medicinePrescriptionSchema = new mongoose.Schema({
  prescriptionId: { type: Number, required: true, unique: true },
  patientId: { type: Number, required: true },
  medId: { type: Number, required: true },
  quantity: Number,
  dosage: String,
  frequency: String,
  duration: String,
  prescribedDate: Date,
  prescribedBy: {
    doctorId: Number,
    doctorName: String
  },
  references: {
    patient: { patientId: Number },
    medicine: { medId: Number }
  }
}, { timestamps: true });

const MedicinePrescription = mongoose.model("MedicinePrescription", medicinePrescriptionSchema);
export default MedicinePrescription;