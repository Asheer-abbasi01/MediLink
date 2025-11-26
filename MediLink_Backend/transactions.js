// transactions.js
import mongoose from "mongoose";
import Bill from "./models/Bill.js"; // only from this file
import Payment from "./models/paymentModel.js";
import Medicine from "./models/Medicine.js";

export const processPayment = async ({
  billId,
  patientId,
  amount,
  paymentMethod,
  cardDetails,
  medicinesUsed = [] // [{ medId, quantity }]
}) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Validation 1: Check if bill exists and is not already paid
    console.log(`Searching for billId: "${billId}" (type: ${typeof billId})`);

    // Mongoose will cast billId to Number automatically based on schema
    const bill = await Bill.findOne({ billId }, null, { session });
    console.log("Bill found:", bill ? "Yes" : "No");

    if (!bill) {
      // Try debugging query without session if it fails
      const debugBill = await Bill.findOne({ billId });
      console.log("Debug check (no session):", debugBill ? "Found" : "Not Found");

      throw new Error(`Bill with ID ${billId} not found`);
    }
    if (bill.status === "Paid") {
      throw new Error(`Bill ${billId} has already been paid`);
    }

    // Validation 2: Verify amount matches bill amount
    if (bill.totalAmount !== amount) {
      throw new Error(`Payment amount ${amount} does not match bill amount ${bill.totalAmount}`);
    }

    // Validation 3: Validate medicine stock availability
    if (medicinesUsed && medicinesUsed.length > 0) {
      for (const med of medicinesUsed) {
        const medicine = await Medicine.findOne({ medId: Number(med.medId) }, null, { session });
        if (!medicine) {
          throw new Error(`Medicine with ID ${med.medId} not found`);
        }
        if (medicine.quantity < med.quantity) {
          throw new Error(`Insufficient stock for medicine ${medicine.name}. Available: ${medicine.quantity}, Required: ${med.quantity}`);
        }
      }
    }

    // 1. Create Payment with unique ID
    // Generate a numeric payment ID or use ObjectId?
    // Schema says paymentId is Number. Let's generate a random number or timestamp
    const paymentId = Date.now(); // Simple numeric ID

    await Payment.create([{
      paymentId,
      billId,
      amount,
      paymentDate: new Date(),
      paymentMethod,
      cardDetails,
      status: "Completed",
      references: { bill: { billId } }
    }], { session });

    // 2. Update Bill Status
    await Bill.updateOne(
      { billId },
      { $set: { status: "Paid", paidAt: new Date() } },
      { session }
    );

    // 3. Update Medicine Stock
    if (medicinesUsed && medicinesUsed.length > 0) {
      for (const med of medicinesUsed) {
        await Medicine.updateOne(
          { medId: med.medId },
          { $inc: { quantity: -med.quantity } },
          { session }
        );
      }
    }

    // Commit Transaction
    await session.commitTransaction();
    console.log("Transaction Successful! Payment ID:", paymentId);
    return {
      success: true,
      message: "Payment processed successfully!",
      paymentId,
      billId
    };

  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction Failed:", error);
    return { success: false, message: error.message };
  } finally {
    session.endSession();
  }
};