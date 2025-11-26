import mongoose from "mongoose";
import Medicine from "../models/Medicine.js";
import dotenv from "dotenv";

dotenv.config();

async function testPurchase() {
    try {
        // 1. Connect to DB to get a valid medicine ID
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const medicine = await Medicine.findOne({ stock: { $gt: 0 } });
        if (!medicine) {
            console.error("❌ No medicine found with stock > 0");
            process.exit(1);
        }

        console.log(`Found medicine: ${medicine.name} (ID: ${medicine._id})`);
        const medicineId = medicine._id.toString();

        // Close DB connection so it doesn't hang
        await mongoose.disconnect();

        // 2. Make API request
        const url = `http://localhost:${process.env.PORT || 5000}/api/medicines/${medicineId}/purchase`;
        console.log(`Testing POST ${url}...`);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: 1 })
        });

        const data = await response.json();

        console.log(`Status Code: ${response.status}`);
        console.log("Response:", JSON.stringify(data, null, 2));

        if (response.status === 200 && data.success) {
            console.log("✅ Purchase endpoint working correctly!");
        } else {
            console.error("❌ Purchase endpoint failed");
        }

    } catch (error) {
        console.error("❌ Test error:", error);
    }
}

testPurchase();
