import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  staffId: { type: Number, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  staffName: { type: String },
  gender: { type: String },
  phoneNo: { type: String },
  address: { type: String },
  role: { type: String },
  dateCreated: { type: Date },
  status: { type: String }
}, { timestamps: true });

const Staff = mongoose.model("Staff", staffSchema);
export default Staff;