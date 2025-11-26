import mongoose from "mongoose";

const nurseSchema = new mongoose.Schema({
  nurseId: { type: Number, required: true, unique: true },
  staffId: { type: Number, required: true },
  certificationLevel: { type: String },
  department: { type: String },
  references: {
    staff: {
      staffId: { type: Number }
    }
  }
}, { timestamps: true });

const Nurse = mongoose.model("Nurse", nurseSchema);
export default Nurse;
