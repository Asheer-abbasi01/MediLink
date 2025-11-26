import mongoose from "mongoose";
import Medicine from "../models/Medicine.js";
import dotenv from "dotenv";

dotenv.config();


/**
 * Migration script to add stock field to existing medicines
 * Run this once after updating the Medicine model
 */
async function addStockToExistingMedicines() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // First, update any old status values to match new enum
        const oldStatusUpdate = await Medicine.updateMany(
            { status: { $nin: ['Available', 'Out of Stock'] } },
            { $set: { status: 'Available' } }
        );
        console.log(`✅ Updated ${oldStatusUpdate.modifiedCount} medicines with old status values to 'Available'`);

        // Count medicines without stock field
        const medicinesWithoutStock = await Medicine.countDocuments({
            stock: { $exists: false }
        });
        console.log(`📊 Found ${medicinesWithoutStock} medicines without stock field`);

        // Update all medicines without stock field
        const stockUpdateResult = await Medicine.updateMany(
            { stock: { $exists: false } },
            { $set: { stock: 50 } } // Set default stock to 50
        );
        console.log(`✅ Updated ${stockUpdateResult.modifiedCount} medicines with stock field (default: 50)`);

        // Generate medicineId for medicines without it (using direct update to avoid validation)
        const medicinesWithoutId = await Medicine.find({
            $or: [
                { medicineId: { $exists: false } },
                { medicineId: null },
                { medicineId: '' }
            ]
        }).select('_id');

        if (medicinesWithoutId.length > 0) {
            console.log(`📊 Found ${medicinesWithoutId.length} medicines without medicineId`);

            for (const medicine of medicinesWithoutId) {
                const uniqueId = `MED-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                await Medicine.updateOne(
                    { _id: medicine._id },
                    { $set: { medicineId: uniqueId } }
                );
            }
            console.log(`✅ Generated medicineId for ${medicinesWithoutId.length} medicines`);
        }

        // Update status based on stock
        const outOfStockResult = await Medicine.updateMany(
            { stock: 0 },
            { $set: { status: 'Out of Stock' } }
        );
        console.log(`✅ Updated ${outOfStockResult.modifiedCount} medicines to 'Out of Stock' status`);

        const availableResult = await Medicine.updateMany(
            { stock: { $gt: 0 } },
            { $set: { status: 'Available' } }
        );
        console.log(`✅ Updated ${availableResult.modifiedCount} medicines to 'Available' status`);

        console.log("\n🎉 Stock migration completed successfully!");

        // Display summary
        const totalMedicines = await Medicine.countDocuments();
        const availableMedicines = await Medicine.countDocuments({ status: 'Available' });
        const outOfStockMedicines = await Medicine.countDocuments({ status: 'Out of Stock' });

        console.log("\n📈 Summary:");
        console.log(`   Total medicines: ${totalMedicines}`);
        console.log(`   Available: ${availableMedicines}`);
        console.log(`   Out of Stock: ${outOfStockMedicines}`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Migration error:", error);
        process.exit(1);
    }
}

// Run the migration
addStockToExistingMedicines();
