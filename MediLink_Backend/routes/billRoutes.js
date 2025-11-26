import express from "express";
import {
  createBill,
  getAllBills,
  getBillById,
  updateBill,
  deleteBill
} from "../controllers/billController.js";

const router = express.Router();

router.post("/", createBill);
router.get("/", getAllBills);
router.get("/:id", getBillById);
router.put("/:id", updateBill);
router.delete("/:id", deleteBill);

export default router; // <-- ESM default export



// import express from "express";
// import mongoose from "mongoose";
// import Bill from "../models/Bill.js";
// import Payment from "../models/Payment.js";

// const router = express.Router();

// // Create bill with transaction
// router.post("/", async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const { billId, patientId, doctorId, totalAmount, status } = req.body;

//     const bill = new Bill({ billId, patientId, doctorId, totalAmount, status });
//     await bill.save({ session });

//     // Create payment for this bill
//     const payment = new Payment({ billId: bill._id, amount: totalAmount, status });
//     await payment.save({ session });

//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json({ ...bill.toObject(), paymentStatus: payment.status });
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error(err);
//     res.status(500).json({ message: "Transaction failed", error: err.message });
//   }
// });

// // Get all bills
// router.get("/", async (req, res) => {
//   try {
//     const bills = await Bill.find().sort({ createdAt: -1 });
//     res.json(bills);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Update bill
// router.put("/:id", async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true, session });
    
//     // Update payment status if bill status changed
//     if (req.body.status) {
//       await Payment.updateMany(
//         { billId: bill._id },
//         { status: req.body.status },
//         { session }
//       );
//     }

//     await session.commitTransaction();
//     session.endSession();
//     res.json(bill);
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ message: err.message });
//   }
// });

// // Delete bill
// router.delete("/:id", async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const bill = await Bill.findById(req.params.id).session(session);
//     if (!bill) throw new Error("Bill not found");

//     await Payment.deleteMany({ billId: bill._id }).session(session);
//     await bill.deleteOne({ session });

//     await session.commitTransaction();
//     session.endSession();
//     res.json({ message: "Bill deleted successfully" });
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;
