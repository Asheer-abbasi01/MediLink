import mongoose from "mongoose";
import Bill from "../models/Bill.js";
import dotenv from "dotenv";

dotenv.config();

async function checkBill() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const billId = "50015002";
        console.log(`Testing queries for billId: "${billId}"`);

        // Test 1: findOne
        console.log("\n--- Test 1: findOne ---");
        const billOne = await Bill.findOne({ billId: billId });
        console.log("findOne result:", billOne ? "Found" : "NULL");

        // Test 2: find (array)
        console.log("\n--- Test 2: find (array) ---");
        const bills = await Bill.find({ billId: billId });
        console.log(`find result count: ${bills.length}`);
        if (bills.length > 0) {
            console.log("First match ID:", bills[0]._id);
        }

        // Test 3: find by _id (if we found one in Test 2)
        if (bills.length > 0) {
            console.log("\n--- Test 3: findById ---");
            const id = bills[0]._id;
            const billById = await Bill.findById(id);
            console.log("findById result:", billById ? "Found" : "NULL");
        }

        // Test 4: Regex search
        console.log("\n--- Test 4: Regex ---");
        const billRegex = await Bill.findOne({ billId: { $regex: new RegExp(`^${billId}$`) } });
        console.log("Regex result:", billRegex ? "Found" : "NULL");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

checkBill();
