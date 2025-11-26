// import mongoose from "mongoose";

// const BillSchema = new mongoose.Schema({
//   billId: { type: String, required: true },
//   patientId: { type: String, required: true },
//   doctorId: { type: String, required: true },
//   medicines: [
//     { medId: String, name: String, quantity: Number }
//   ],
//   totalAmount: Number,
//   status: { type: String, enum: ["Paid", "Pending", "Cancelled"] },
//   date: { type: Date, default: Date.now }
// });

// export default mongoose.model("Bill", BillSchema);


import mongoose from "mongoose";

const BillSchema = new mongoose.Schema({
  billId: { type: Number, required: true },
  patientId: { type: Number, required: true },
  doctorId: { type: Number, required: true },
  medicines: [{ medId: String, name: String, quantity: Number }],
  totalAmount: Number,
  status: { type: String, enum: ["Paid", "Pending", "Cancelled"] },
  date: { type: Date, default: Date.now }
});

// Force exact collection name "bill"
const Bill = mongoose.models.Bill || mongoose.model("Bill", BillSchema, "bill");

export default Bill;


