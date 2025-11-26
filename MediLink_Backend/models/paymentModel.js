// import mongoose from "mongoose";

// const cardDetailsSchema = new mongoose.Schema({
//   cardType: String,
//   lastFourDigits: String
// }, { _id: false });

// const paymentSchema = new mongoose.Schema({
//   paymentId: { type: Number, required: true, unique: true },
//   billId: { type: Number, required: true },
//   amount: Number,
//   paymentDate: Date,
//   paymentMethod: String,
//   cardDetails: cardDetailsSchema,
//   status: String,
//   references: {
//     bill: { billId: Number }
//   }
// }, { timestamps: true });

// // Third parameter specifies the exact collection name
// const Payment = mongoose.model("Payment", paymentSchema, "payment");

// export default Payment;

import mongoose from "mongoose";

const cardDetailsSchema = new mongoose.Schema({
  cardType: String,
  lastFourDigits: String
}, { _id: false });

const paymentSchema = new mongoose.Schema({
  paymentId: { type: Number, required: true, unique: true },
  billId: { type: Number, required: true },
  amount: Number,
  paymentDate: Date,
  paymentMethod: String,
  cardDetails: cardDetailsSchema,
  status: String,
  references: {
    bill: { billId: Number }
  }
}, { timestamps: true });

// ✅ Prevent OverwriteModelError
const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema, "payment");

export default Payment;
