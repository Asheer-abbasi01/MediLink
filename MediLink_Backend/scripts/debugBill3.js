import mongoose from "mongoose";
import Bill from "../models/Bill.js";
import dotenv from "dotenv";

dotenv.config();

async function checkBill() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // ID found in previous debug step
        const knownId = "68f1ee4297b8a6f456985cf2";

        console.log(`\n--- Fetching by _id: ${knownId} ---`);
        const bill = await Bill.findById(knownId).lean();

        if (bill) {
            console.log("✅ Found Bill by _id!");
            console.log("Raw Document Keys:", Object.keys(bill));
            console.log("billId value:", bill.billId);
            console.log("billId type:", typeof bill.billId);
            console.log("Full Document:", JSON.stringify(bill, null, 2));

            // Check for hidden characters again on the raw value
            if (typeof bill.billId === 'string') {
                console.log(`Char codes: ${bill.billId.split('').map(c => c.charCodeAt(0)).join(', ')}`);
            }

            // Try to find it using the EXACT value from the document
            console.log("\n--- Trying to find using value from document ---");
            const foundAgain = await Bill.findOne({ billId: bill.billId });
            console.log("Found again using billId?", foundAgain ? "YES" : "NO");

        } else {
            console.log("❌ Could not find bill by _id either!");
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

checkBill();
