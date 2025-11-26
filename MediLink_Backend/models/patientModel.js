// import mongoose from "mongoose";

// const emergencyContactSchema = new mongoose.Schema({
//   name: String,
//   relationship: String,
//   phoneNo: String
// }, { _id: false });

// const patientSchema = new mongoose.Schema({
//   patientId: { type: Number, required: true, unique: true },
//   firstName: String,
//   lastName: String,
//   gender: String,
//   phoneNo: String,
//   address: String,
//   bloodType: String,
//   dateOfBirth: Date,
//   emergencyContact: emergencyContactSchema,
//   dateRegistered: Date,
//   status: String
// }, { timestamps: true });

// // 👇 Use exact collection name 'patient' (not 'patients')
// const Patient = mongoose.model("Patient", patientSchema, "patient");

// export default Patient;


import mongoose from "mongoose";

// Emergency Contact Schema
const emergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  relationship: { type: String, required: true, trim: true },
  phoneNo: { type: String, required: true, trim: true, index: true } // index for faster lookup
}, { _id: false });

// Patient Schema
const patientSchema = new mongoose.Schema({
  patientId: { type: Number, required: true, unique: true, index: true }, // unique index for fast lookup
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  phoneNo: { type: String, required: true, trim: true, index: true },
  address: { type: String, trim: true },
  bloodType: { 
    type: String, 
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], 
    index: true 
  },
  dateOfBirth: { type: Date, required: true },
  emergencyContact: emergencyContactSchema,
  dateRegistered: { type: Date, default: Date.now },
  status: { type: String, enum: ["Active", "Inactive", "Deceased"], default: "Active", index: true }
}, { timestamps: true });

// 🔹 Compound index example: bloodType + status
patientSchema.index({ bloodType: 1, status: 1 });

// 🔹 Text index for searching patients by name
patientSchema.index({ firstName: "text", lastName: "text" });

// 👇 Use exact collection name 'patient' (not 'patients')
const Patient = mongoose.model("Patient", patientSchema, "patient");

export default Patient;