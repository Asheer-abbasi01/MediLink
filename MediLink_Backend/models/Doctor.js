import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  doctorId: { type: Number, required: true, unique: true },
  staffId: { type: Number, required: true },
  name: { type: String, required: true },
  contact: { type: String },
  specialty: { type: String },
  licenseNumber: { type: String },
  yearsExperience: { type: Number },
  qualifications: [String],
  references: {
    staff: {
      staffId: Number
    }
  }
}, { timestamps: true });

// Force exact collection name 'doctor'
const Doctor = mongoose.model("Doctor", doctorSchema, "doctor");

export default Doctor;


// import mongoose from "mongoose";

// const doctorSchema = new mongoose.Schema({
//   doctorId: { type: Number, required: true, unique: true },
//   staffId: { type: Number, required: true },
//   name: { type: String, required: true },
//   contact: { type: String },
//   specialty: { type: String },
//   licenseNumber: { type: String },
//   yearsExperience: { type: Number },
//   qualifications: [String],
//   references: {
//     staff: {
//       staffId: Number
//     }
//   }
// }, { timestamps: true });

// /* 🔥 IMPORTANT INDEXES FOR FAST QUERIES */

// // search doctors by name (very common)
// doctorSchema.index({ name: 1 });

// // search by specialty (common in filtering)
// doctorSchema.index({ specialty: 1 });

// // faster sorting by experience
// doctorSchema.index({ yearsExperience: -1 });

// // searching by staffId
// doctorSchema.index({ staffId: 1 });

// // sort by createdAt / updatedAt (pagination)
// doctorSchema.index({ createdAt: -1 });

// /* Keep exact collection name */
// const Doctor = mongoose.model("Doctor", doctorSchema, "doctor");

// export default Doctor;
