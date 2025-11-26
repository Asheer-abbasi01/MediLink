import mongoose from "mongoose";
import Bill from "../models/Bill.js";
import dotenv from "dotenv";

dotenv.config();

async function checkBill() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const billId = "50015002";
        console.log(`Searching for bill with billId: "${billId}" (type: ${typeof billId})`);

        // Try exact match
        const bill = await Bill.findOne({ billId: billId });

        if (bill) {
            console.log("✅ Found Bill:");
            console.log(JSON.stringify(bill, null, 2));
        } else {
            console.log("❌ Bill NOT found with exact string match.");

            // Try finding all bills to see what's there
            const allBills = await Bill.find({}).limit(5);
            console.log("\nFirst 5 bills in database:");
            allBills.forEach(b => {
                console.log(`- ID: ${b._id}`);
                console.log(`  billId: "${b.billId}" (length: ${b.billId.length})`);
                console.log(`  Char codes: ${b.billId.split('').map(c => c.charCodeAt(0)).join(', ')}`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

checkBill();
